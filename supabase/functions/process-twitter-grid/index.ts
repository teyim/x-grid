// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as sharp from "https://esm.sh/sharp@0.33.0?target=deno";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

console.log("Hello from Functions!")

serve(async (req) => {
  const { jobId } = await req.json();

  // Mark job as processing
  await supabase.from("processing_jobs").update({ status: "processing" }).eq("id", jobId);

  // Fetch job details
  const { data: job, error: jobError } = await supabase
    .from("processing_jobs")
    .select("raw_files")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    await supabase.from("processing_jobs").update({ status: "failed" }).eq("id", jobId);
    return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
  }

  // 1. Download all images
  const fileBuffers: Uint8Array[] = [];
  for (const path of job.raw_files) {
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from("raw-uploads")
      .download(path);

    if (downloadError || !fileData) {
      await supabase.from("processing_jobs").update({ status: "failed" }).eq("id", jobId);
      return new Response(JSON.stringify({ error: "Failed to download file" }), { status: 500 });
    }
    const arrayBuffer = await fileData.arrayBuffer();
    fileBuffers.push(new Uint8Array(arrayBuffer));
  }

  // 2. Prepare images
  const [main, ...rest] = fileBuffers;
  const headers = rest.slice(0, 4);
  const footers = rest.slice(4, 8);

  // 3. Split main image into quadrants
  const mainMeta = await sharp.default(main).metadata();
  const w = mainMeta.width ?? 2160;
  const h = mainMeta.height ?? 2160;
  const halfW = Math.floor(w / 2);
  const halfH = Math.floor(h / 2);

  const quadrants = await Promise.all([
    sharp.default(main).extract({ left: 0, top: 0, width: halfW, height: halfH }).toBuffer(), // TL
    sharp.default(main).extract({ left: halfW, top: 0, width: w - halfW, height: halfH }).toBuffer(), // TR
    sharp.default(main).extract({ left: 0, top: halfH, width: halfW, height: h - halfH }).toBuffer(), // BL
    sharp.default(main).extract({ left: halfW, top: halfH, width: w - halfW, height: h - halfH }).toBuffer(), // BR
  ]);

  // 4. Compose each vertical image
  const positions = ["tl", "tr", "bl", "br"] as const;
  const processedFiles: string[] = [];

  for (let i = 0; i < 4; i++) {
    // Resize header/footer
    const header = await sharp.default(headers[i]).resize(1080, 640).toBuffer();
    const footer = await sharp.default(footers[i]).resize(1080, 640).toBuffer();

    // Optionally shift the quadrant (example: no shift for MVP)
    const quadrant = await sharp.default(quadrants[i]).resize(1080, 640).toBuffer();

    // Compose vertical image
    const composite = await sharp.default({
      create: { width: 1080, height: 1920, channels: 3, background: "white" }
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
      .from("processed-results")
      .upload(processedPath, composite, { upsert: true });

    if (uploadError) {
      await supabase.from("processing_jobs").update({ status: "failed" }).eq("id", jobId);
      return new Response(JSON.stringify({ error: "Failed to upload processed file" }), { status: 500 });
    }

    processedFiles.push(processedPath);
  }

  // 5. Update job as completed
  await supabase.from("processing_jobs").update({
    status: "completed",
    processed_files: processedFiles,
    completed_at: new Date().toISOString(),
  }).eq("id", jobId);

  return new Response(JSON.stringify({ resultUrls: processedFiles }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-twitter-grid' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
