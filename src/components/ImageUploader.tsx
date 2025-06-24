'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

export default function ImageUploader({ onUploadComplete }: { onUploadComplete: (jobId: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (files.length !== 9) {
      alert('Please select exactly 9 images.');
      return;
    }

    setUploading(true);

    try {
      // 1. Create a new processing job
      const { data: jobData, error: jobError } = await supabase
        .from('processing_jobs')
        .insert([{}])
        .select('id')
        .single();

      if (jobError || !jobData) {
        throw jobError || new Error('Failed to create processing job.');
      }

      const jobId = jobData.id;

      // 2. Upload files to Supabase storage
      const uploadPromises = files.map(file => {
        const filePath = `${jobId}/${file.name}`;
        return supabase.storage.from('raw-uploads').upload(filePath, file);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const uploadErrors = uploadResults.filter(result => result.error);
      if (uploadErrors.length > 0) {
        throw new Error(`Failed to upload files: ${uploadErrors.map(e => e.error?.message).join(', ')}`);
      }
      
      const filePaths = uploadResults.map(result => result.data?.path).filter((p): p is string => !!p);

      // 3. Update the job with file references
      const { error: updateError } = await supabase
        .from('processing_jobs')
        .update({ raw_files: filePaths })
        .eq('id', jobId);
      
      if (updateError) {
        throw updateError;
      }

      // 4. Trigger the edge function
      const { error: functionError } = await supabase.functions.invoke('process-twitter-grid', {
        body: { jobId },
      });

      if (functionError) {
        throw new Error(`Failed to trigger processing function: ${functionError.message}`);
      }
      
      // 5. Signal completion
      onUploadComplete(jobId);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        handleUpload(Array.from(files));
      }
    };
    input.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 border-2 border-dashed rounded-lg text-center">
      <p className="mb-4 text-muted-foreground">Select 9 images for your grid.</p>
      <Button onClick={handleFileSelect} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Select Images'}
      </Button>
    </div>
  );
} 