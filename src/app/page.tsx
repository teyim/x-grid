'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ProcessingMonitor from '@/components/ProcessingMonitor';
import { Button } from '@/components/ui/button';

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
            X-Grid
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Upload your images to create stunning grid illusion for your Twitter posts.
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
      {/* How to Use and FAQ Section */}
      <section className="container mx-auto max-w-3xl my-16 px-2 sm:px-4">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-base sm:text-lg text-gray-800">
            <li>
              <b>Select Images for Your Twitter Grid:</b> Click the <span className="font-mono">Select Images</span> button to upload images from your device. You must select exactly <b>9 images</b> to proceed.
            </li>
            <li>
              <b>Assign Images to Grid Quadrants:</b> After uploading, assign each image to a specific slot in the grid (Header, Main, Footer for each quadrant). Click on a slot (e.g., <span className="font-mono">Header TL</span>, <span className="font-mono">Main</span>, <span className="font-mono">Footer BR</span>) and choose an image to assign. All slots must be filled before you can continue.
            </li>
            <li>
              <b>Upload and Process:</b> Once all images are assigned, click <span className="font-mono">Upload Images</span>. The app will process your images and generate a Twitter-style grid preview.
            </li>
            <li>
              <b>Preview and Download:</b> After processing, you&apos;ll see a preview of your Twitter grid as it would appear in a tweet. Download each grid image using the provided download buttons.
            </li>
            <li>
              <b>Convert Another Grid:</b> Use the <span className="font-mono">Convert Another Image Grid</span> button to start over and create a new grid.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h2>
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}

// FAQ Accordion Component
function FaqAccordion() {
  const faqs = [
    {
      q: 'Why do I need to upload exactly 9 images?',
      a: 'The app is designed to create a 3x3 Twitter grid, which requires 9 images—one for each slot (Header, Main, Footer in each quadrant).',
    },
    {
      q: 'What image formats are supported?',
      a: 'You can upload any standard image format (JPEG, PNG, etc.). All images must be valid and non-corrupted.',
    },
    {
      q: 'How do I assign images to specific grid slots?',
      a: 'After uploading, click on a slot (e.g., "Header TL") and select the image you want to assign. Repeat for all slots.',
    },
    {
      q: 'What happens after I upload and assign all images?',
      a: 'The app processes your images and displays a Twitter-style preview. You can then download each part of the grid.',
    },
    {
      q: 'Can I re-do or change my grid after processing?',
      a: 'Yes! Click "Convert Another Image Grid" to start over and upload a new set of images.',
    },
    {
      q: 'My upload failed or processing didn\'t complete. What should I do?',
      a: 'If processing fails, you&apos;ll see an error message. Please check your internet connection and try again. If the problem persists, check the function logs or contact support.',
    },
    {
      q: 'Where are my images stored?',
      a: 'Uploaded images are stored securely using Supabase Storage and are only used for processing your grid.',
    },
    {
      q: 'Is my data private?',
      a: 'Yes, your images are only used for the grid you create and are not shared with third parties.',
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border rounded-lg bg-white/80 overflow-x-auto">
          <Button
            variant="ghost"
            className="w-full flex flex-wrap justify-between items-center text-left px-3 sm:px-4 py-3 text-base sm:text-lg font-medium"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
          >
            <span className="flex-1 min-w-0 truncate pr-2">{faq.q}</span>
            <span className="ml-2 text-xl sm:text-2xl">{openIndex === idx ? '−' : '+'}</span>
          </Button>
          {openIndex === idx && (
            <div
              id={`faq-panel-${idx}`}
              className="px-4 sm:px-6 pb-4 pt-1 text-gray-700 animate-fade-in text-sm sm:text-base break-words"
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
