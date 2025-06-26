import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { jobId, assignments } = await req.json();

  await supabase.from('processing_jobs').update({ status: 'processing' }).eq('id', jobId);

  const { data: job, error: jobError } = await supabase
    .from('processing_jobs')
    .select('raw_files')
    .eq('id', jobId)
    .single();

  if (jobError || !job || !job.raw_files || job.raw_files.length < 9) {
    await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
    return NextResponse.json({ error: 'Job not found or not enough files provided' }, { status: 404 });
  }

  // Map file name to storage path
  const fileNameToPath: { [name: string]: string } = {};
  for (const path of job.raw_files) {
    const name = path.split('/').pop();
    if (name) fileNameToPath[name] = path;
  }

  // Download all files and map by filename
  const fileBuffers: { [name: string]: Buffer } = {};
  for (const name in fileNameToPath) {
    const path = fileNameToPath[name];
    const { data, error } = await supabase.storage.from('raw-uploads').download(path);
    if (error || !data) {
      await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
      return NextResponse.json({ error: `Failed to download file: ${path}` }, { status: 500 });
    }
    fileBuffers[name] = Buffer.from(await data.arrayBuffer());
  }

  // Use assignments to get the correct buffer for each slot
  const main = fileBuffers[assignments['main']];
  const headers = [
    fileBuffers[assignments['header-tl']],
    fileBuffers[assignments['header-tr']],
    fileBuffers[assignments['header-bl']],
    fileBuffers[assignments['header-br']],
  ];
  const footers = [
    fileBuffers[assignments['footer-tl']],
    fileBuffers[assignments['footer-tr']],
    fileBuffers[assignments['footer-bl']],
    fileBuffers[assignments['footer-br']],
  ];

  const gridWidth = 600 * 2;   // 1200
  const gridHeight = 337 * 2;  // 674

  // 1. Resize main image to 1200x674 (fit: 'fill' to avoid cropping/padding)
  const resizedMain = await sharp(main)
    .resize(gridWidth, gridHeight, { fit: 'fill' })
    .toBuffer();

  // 2. Extract 4 tiles of 600x337 each
  const quadrants = await Promise.all([
    sharp(resizedMain)
      .extract({ left: 0, top: 0, width: 600, height: 337 })
      .toBuffer(), // Top-left
    sharp(resizedMain)
      .extract({ left: 600, top: 0, width: 600, height: 337 })
      .toBuffer(), // Top-right
    sharp(resizedMain)
      .extract({ left: 0, top: 337, width: 600, height: 337 })
      .toBuffer(), // Bottom-left
    sharp(resizedMain)
      .extract({ left: 600, top: 337, width: 600, height: 337 })
      .toBuffer(), // Bottom-right
  ]);

  // 2. Compose each vertical image (1080x1920)
  const finalWidth = 600;
  const partHeight = 337;
  const finalHeight = partHeight * 3; // 1011, but you can use 1012 if you want to add 1px somewhere

  const positions = ['tl', 'tr', 'bl', 'br'] as const;
  const processedFiles: string[] = [];

  for (let i = 0; i < 4; i++) {
    const resizedHeader = await sharp(headers[i]).resize(finalWidth, partHeight, { fit: 'cover' }).toBuffer();
    const resizedQuadrant = await sharp(quadrants[i]).resize(finalWidth, partHeight, { fit: 'cover' }).toBuffer();
    const resizedFooter = await sharp(footers[i]).resize(finalWidth, partHeight, { fit: 'cover' }).toBuffer();

    const composite = await sharp({
      create: { width: finalWidth, height: finalHeight, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
    })
      .composite([
        { input: resizedHeader, top: 0, left: 0 },
        { input: resizedQuadrant, top: partHeight, left: 0 },
        { input: resizedFooter, top: partHeight * 2, left: 0 },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    const processedPath = `${jobId}/result-${positions[i]}.jpg`;
    const { error: uploadError } = await supabase
      .storage
      .from('processed-results')
      .upload(processedPath, composite, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) {
      await supabase.from('processing_jobs').update({ status: 'failed' }).eq('id', jobId);
      return NextResponse.json({ error: `Failed to upload composite image ${positions[i]}` }, { status: 500 });
    }
    processedFiles.push(processedPath);
  }

  // 3. Update job as completed
  await supabase.from('processing_jobs').update({
    status: 'completed',
    processed_files: processedFiles,
    completed_at: new Date().toISOString(),
  }).eq('id', jobId);

  const resultUrls = processedFiles.map(path => {
      const { data: { publicUrl } } = supabase.storage.from('processed-results').getPublicUrl(path);
      return {
        previewUrl: publicUrl,
        downloadUrl: `${publicUrl}?download=true`,
      };
  });

  return NextResponse.json({ resultUrls });
}