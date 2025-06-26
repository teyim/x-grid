
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TwitterGridPreview from '@/components/TwitterGridPreview';


export default function ProcessingMonitor({ jobId, onBack, onConvertAnother }: { jobId: string, onBack?: () => void, onConvertAnother?: () => void }) {
  const [status, setStatus] = useState('processing');
  const [resultUrls, setResultUrls] = useState<string[]>([]);

  useEffect(() => {
    // Fetch initial job state
    const fetchJob = async () => {
      const { data } = await supabase
        .from('processing_jobs')
        .select('status, processed_files')
        .eq('id', jobId)
        .single();
      
      if (data) {
        setStatus(data.status);
        if (data.processed_files) {
          // Construct full URLs from paths
          const urls = data.processed_files.map((path: string) => 
            supabase.storage.from('processed-results').getPublicUrl(path).data.publicUrl
          );
          setResultUrls(urls);
        }
      }
    };
    fetchJob();

    // Listen for real-time updates
    const channel = supabase.channel(`job-status:${jobId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'processing_jobs',
        filter: `id=eq.${jobId}`
      }, (payload) => {
        const newStatus = payload.new.status;
        setStatus(newStatus);
        if (newStatus === 'completed' && payload.new.processed_files) {
          const urls = payload.new.processed_files.map((path: string) => 
            supabase.storage.from('processed-results').getPublicUrl(path).data.publicUrl
          );
          setResultUrls(urls);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return (
    <div className="w-full mx-auto p-2 sm:p-8 border rounded-lg text-center max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Post Preview</h2>
      {status === 'pending' && <p className="text-muted-foreground">Waiting to start...</p>}
      {status === 'processing' && (
        <div>
          <p className="text-muted-foreground">Your images are being processed...</p>
          {/* We can add a progress bar here later */}
        </div>
      )}
      {status === 'completed' && (
        <TwitterGridPreview images={resultUrls} onBack={onBack} onConvertAnother={onConvertAnother} />
      )}
      {status === 'failed' && (
        <div>
          <p className="text-red-500 font-semibold">Processing Failed. Please check the function logs.</p>
        </div>
      )}
    </div>
  );
} 