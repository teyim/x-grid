import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();

  // 1. Update job status
  await supabase.from('processing_jobs').update({ status: 'processing' }).eq('id', jobId);

  // 2. Fetch job details
  const { data: job, error: jobError } = await supabase
    .from('processing_jobs')
    .select('raw_files')
    .eq('id', jobId)
    .single();

  if (jobError || !job || !job.raw_files || job.raw_files.length < 9) {
    await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
    return NextResponse.json({ error: 'Job not found or not enough files' }, { status: 404 });
  }

  // 3. Download all images
  const fileBuffers: Buffer[] = [];
  for (const path of job.raw_files) {
    const { data, error } = await supabase.storage.from('raw-uploads').download(path);
    if (error || !data) {
      await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }
    const arrayBuffer = await data.arrayBuffer();
    fileBuffers.push(Buffer.from(arrayBuffer));
  }

  // 4. Prepare images
  const [main, ...rest] = fileBuffers;
  const headers = rest.slice(0, 4);
  const footers = rest.slice(4, 8);

  // 5. Resize main image to 2160x1280 (2x1080, 2x640) to fit the grid perfectly
  const gridWidth = 1080 * 2;
  const gridHeight = 640 * 2;
  const resizedMain = await sharp(main)
    .resize(gridWidth, gridHeight, { fit: 'cover' }) // 'contain' ensures no cropping, may add padding
    .toBuffer();

  // 6. Extract 4 tiles of 1080x640 each
  const quadrants = await Promise.all([
    sharp(resizedMain)
      .extract({ left: 0, top: 0, width: 1080, height: 640 })
      .toBuffer(), // TL
    sharp(resizedMain)
      .extract({ left: 1080, top: 0, width: 1080, height: 640 })
      .toBuffer(), // TR
    sharp(resizedMain)
      .extract({ left: 0, top: 640, width: 1080, height: 640 })
      .toBuffer(), // BL
    sharp(resizedMain)
      .extract({ left: 1080, top: 640, width: 1080, height: 640 })
      .toBuffer(), // BR
  ]);

  // 7. Compose each vertical image
  const positions = ['tl', 'tr', 'bl', 'br'] as const;
  const processedFiles: string[] = [];

  for (let i = 0; i < 4; i++) {
    const header = await sharp(headers[i]).resize(1080, 640).toBuffer();
    const footer = await sharp(footers[i]).resize(1080, 640).toBuffer();
    const quadrant = await sharp(quadrants[i]).resize(1080, 640).toBuffer();

    const composite = await sharp({
      create: { width: 1080, height: 1920, channels: 3, background: 'white' }
    })
      .composite([
        { input: header, top: 0, left: 0 },
        { input: quadrant, top: 640, left: 0 },
        { input: footer, top: 1280, left: 0 }
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload to processed-results
    const processedPath = `${jobId}/result-${positions[i]}.jpg`;
    const { error: uploadError } = await supabase
      .storage
      .from('processed-results')
      .upload(processedPath, composite, { upsert: true });

    if (uploadError) {
      await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
      return NextResponse.json({ error: 'Failed to upload processed file' }, { status: 500 });
    }

    processedFiles.push(processedPath);
  }

  // 8. Update job as completed
  await supabase.from('processing_jobs').update({
    status: 'completed',
    processed_files: processedFiles,
    completed_at: new Date().toISOString(),
  }).eq('id', jobId);

  return NextResponse.json({ resultUrls: processedFiles });
}