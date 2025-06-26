'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ProcessingMonitor from '@/components/ProcessingMonitor';

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);

  const handleUploadComplete = (id: string) => {
    setJobId(id);
  };

  // Handler to go back to grid selection or start another conversion
  const handleBackOrConvertAnother = () => {
    setJobId(null);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Twitter Grid Image Processor
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Upload your images to create stunning grid layouts for your Twitter profile.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!jobId ? (
            <ImageUploader onUploadComplete={handleUploadComplete} />
          ) : (
            <ProcessingMonitor jobId={jobId} onBack={handleBackOrConvertAnother} onConvertAnother={handleBackOrConvertAnother} />
          )}
        </div>
      </main>
    </div>
  );
}
