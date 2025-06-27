'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TwitterGridPreview from '@/components/TwitterGridPreview';
import { ProcessedImage } from '@/lib/imageProcessor';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[] | null>(null);

  const handleUploadComplete = (images: ProcessedImage[]) => {
    setProcessedImages(images);
  };

  // Handler to go back to grid selection or start another conversion
  const handleBackOrConvertAnother = () => {
    setProcessedImages(null);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-6 px-2 sm:py-12 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
            X-Grid
          </h1>
          <p className="mt-3 sm:mt-4 max-w-xs sm:max-w-2xl mx-auto text-muted-foreground text-base sm:text-xl">
            Upload your images to create stunning grid illusion for your Twitter posts.
          </p>
        </div>
        <div className="w-full max-w-full sm:max-w-4xl mx-auto">
          {!processedImages ? (
            <ImageUploader onUploadComplete={handleUploadComplete} />
          ) : (
            <TwitterGridPreview 
              images={processedImages.map(img => img.url)} 
              processedImages={processedImages}
              onBack={handleBackOrConvertAnother} 
              onConvertAnother={handleBackOrConvertAnother} 
            />
          )}
        </div>
      </main>
      {/* How to Use and FAQ Section */}
      <section className="container mx-auto max-w-full sm:max-w-3xl my-10 sm:my-16 px-1 sm:px-4">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base md:text-lg text-gray-800 overflow-x-auto">
            <li>
              <b>Choose a Mode:</b> Use the toggle to select between <span className="font-mono">9 Images (Custom Grid)</span> and <span className="font-mono">1 Image (Auto 4-Grid)</span> mode.
            </li>
            <li>
              <b>For 9 Images:</b> Click the <span className="font-mono">Select Images</span> button to upload images from your device. You must select exactly <b>9 images</b> to proceed. Assign each image to a specific slot in the grid (Header, Main, Footer for each quadrant).
            </li>
            <li>
              <b>For 1 Image:</b> Click the <span className="font-mono">Select Image</span> button to upload a single image. The app will automatically split it into a 2x2 grid illusion for you.
            </li>
            <li>
              <b>Process Images:</b> Once ready, click <span className="font-mono">Process Images</span> or <span className="font-mono">Split into Grid</span>. The app will process your images client-side and generate a Twitter-style grid preview.
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Frequently Asked Questions (FAQ)</h2>
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
      q: 'What is the difference between 9-image and 1-image mode?',
      a: 'In 9-image mode, you upload and assign 9 separate images to create a custom Twitter grid illusion. In 1-image mode, you upload a single image and the app automatically splits it into 4 quadrants for a quick 2x2 grid illusion.'
    },
    {
      q: 'Why do I need to upload exactly 9 images?',
      a: 'The app is designed to create a 3x3 Twitter grid, which requires 9 images—one for each slot (Header, Main, Footer in each quadrant).'
    },
    {
      q: 'What image formats are supported?',
      a: 'You can upload any standard image format (JPEG, PNG, etc.). All images must be valid and non-corrupted.'
    },
    {
      q: 'How do I assign images to specific grid slots?',
      a: 'After uploading, click on a slot (e.g., "Header TL") and select the image you want to assign. Repeat for all slots.'
    },
    {
      q: 'What happens after I upload and assign all images?',
      a: 'The app processes your images client-side and displays a Twitter-style preview. You can then download each part of the grid.'
    },
    {
      q: 'Can I re-do or change my grid after processing?',
      a: 'Yes! Click "Convert Another Image Grid" to start over and upload a new set of images.'
    },
    {
      q: 'My upload failed or processing didn\'t complete. What should I do?',
      a: 'If processing fails, you&apos;ll see an error message. Please check your browser supports canvas operations and try again. If the problem persists, try refreshing the page.'
    },
    {
      q: 'Where are my images stored?',
      a: 'All image processing happens in your browser. Your images are never uploaded to any server and remain private.'
    },
    {
      q: 'Is my data private?',
      a: 'Yes, your images are processed entirely in your browser and are never sent to any server or third party.'
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
