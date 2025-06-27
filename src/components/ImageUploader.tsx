'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SlotPreview from './SlotPreview';
import Image from 'next/image';
import { Image as LucideImage } from 'lucide-react';
import { ClientImageProcessor, ImageAssignments, ProcessedImage } from '@/lib/imageProcessor';

// Slot names: main, header-tl, header-tr, header-bl, header-br, footer-tl, footer-tr, footer-bl, footer-br
const slots = [
  { key: 'main', label: 'Main (to be split)' },
  { key: 'header-tl', label: 'Header TL' },
  { key: 'header-tr', label: 'Header TR' },
  { key: 'header-bl', label: 'Header BL' },
  { key: 'header-br', label: 'Header BR' },
  { key: 'footer-tl', label: 'Footer TL' },
  { key: 'footer-tr', label: 'Footer TR' },
  { key: 'footer-bl', label: 'Footer BL' },
  { key: 'footer-br', label: 'Footer BR' },
];

export default function ImageUploader({ onUploadComplete }: { onUploadComplete: (processedImages: ProcessedImage[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slotToAssign, setSlotToAssign] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialShown, setTutorialShown] = useState(false);
  const [mode, setMode] = useState<'nine' | 'single'>('nine');
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);

  // assignments: { [slot: string]: File | null }
  const [assignments, setAssignments] = useState<{ [slot: string]: File | null }>(
    Object.fromEntries(slots.map(s => [s.key, null]))
  );

  const imagesLeft = 9 - selectedFiles.length;
  // Check if all slots are assigned
  const allSlotsAssigned = Object.values(assignments).every(f => f !== null);

  // Show tutorial modal when 9 images are uploaded for the first time
  useEffect(() => {
    if (selectedFiles.length === 9 && !tutorialShown) {
      setShowTutorial(true);
      setTutorialShown(true);
    }
  }, [selectedFiles.length, tutorialShown]);

  const handleUpload = async () => {
    if (selectedFiles.length !== 9) {
      setError('Please select exactly 9 images.');
      return;
    }
    if (!allSlotsAssigned) {
      setError('Please assign all images to the grid quadrants before uploading.');
      return;
    }
    setError(null);
    setUploading(true);
    
    try {
      const processor = new ClientImageProcessor();
      
      // Convert assignments to the format expected by the processor
      const imageAssignments: ImageAssignments = {
        main: assignments.main!,
        'header-tl': assignments['header-tl']!,
        'header-tr': assignments['header-tr']!,
        'header-bl': assignments['header-bl']!,
        'header-br': assignments['header-br']!,
        'footer-tl': assignments['footer-tl']!,
        'footer-tr': assignments['footer-tr']!,
        'footer-bl': assignments['footer-bl']!,
        'footer-br': assignments['footer-br']!,
      };

      const processedImages = await processor.processImages(imageAssignments);
      processor.dispose();
      
      onUploadComplete(processedImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
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
        // Append new files, filter out duplicates by name, and limit to 9
        const arr = Array.from(files);
        const allFiles = [...selectedFiles, ...arr];
        const uniqueFiles = Array.from(new Map(allFiles.map(f => [f.name, f])).values()).slice(0, 9);
        setSelectedFiles(uniqueFiles);
        if (uniqueFiles.length < 9) {
          setError(`Please add ${9 - uniqueFiles.length} more image${9 - uniqueFiles.length > 1 ? 's' : ''}.`);
        } else if (uniqueFiles.length > 9) {
          setError(`Please remove ${uniqueFiles.length - 9} image${uniqueFiles.length - 9 > 1 ? 's' : ''}.`);
        } else {
          setError(null);
        }
      }
    };
    input.click();
  };

  function openFilePicker(slotKey: string) {
    setSlotToAssign(slotKey);
  }

  function assignToSlot(file: File) {
    if (slotToAssign) {
      setAssignments(prev => ({ ...prev, [slotToAssign]: file }));
      setSlotToAssign(null);
    }
  }

  function assignToCurrentSlot(file: File) {
    if (slotToAssign) {
      assignToSlot(file);
    }
  }

  // --- Single image mode handlers ---
  const handleSingleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setSingleFile(files[0]);
        setSingleError(null);
      }
    };
    input.click();
  };

  const handleSingleProcess = async () => {
    if (!singleFile) {
      setSingleError('Please select an image.');
      return;
    }
    setUploading(true);
    setSingleError(null);
    try {
      const processor = new ClientImageProcessor();
      const processedImages = await processor.splitImageToGrid(singleFile);
      processor.dispose();
      onUploadComplete(processedImages);
    } catch (error) {
      setSingleError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-2 sm:p-8 border-2 border-dashed rounded-lg text-center">
      {/* Mode toggle */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-2 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto">
        <Button
          variant={mode === 'nine' ? 'default' : 'outline'}
          onClick={() => setMode('nine')}
          disabled={uploading}
          className="w-full sm:w-auto py-3 text-base"
        >
          9 Images (Custom Grid)
        </Button>
        <Button
          variant={mode === 'single' ? 'default' : 'outline'}
          onClick={() => setMode('single')}
          disabled={uploading}
          className="w-full sm:w-auto py-3 text-base"
        >
          1 Image (Auto 4-Grid)
        </Button>
      </div>
      {/* Single image mode */}
      {mode === 'single' && (
        <div>
          <p className="mb-4 text-muted-foreground">Upload 1 image to split into a 2x2 grid illusion.</p>
          <Button onClick={handleSingleFileSelect} disabled={uploading || !!singleFile}>
            {singleFile ? 'Image Selected' : 'Select Image'}
          </Button>
          {singleFile && (
            <div className="mt-4 flex flex-col items-center">
              <Image
                src={URL.createObjectURL(singleFile)}
                className="object-cover border rounded w-40 h-24"
                width={160}
                height={96}
                alt="Single preview"
              />
              <Button
                className="mt-4"
                onClick={handleSingleProcess}
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Split into Grid'}
              </Button>
              <Button
                className="mt-2"
                variant="ghost"
                onClick={() => setSingleFile(null)}
                disabled={uploading}
              >
                Remove Image
              </Button>
            </div>
          )}
          {singleError && <div className="text-red-500 text-sm mt-2">{singleError}</div>}
        </div>
      )}
      {/* 9-image mode (existing UI) */}
      {mode === 'nine' && (
        <>
          <p className="mb-4 text-muted-foreground">Select 9 images for your grid.</p>
          {selectedFiles.length < 9 && (
            <div className="text-blue-600 text-sm mb-2">
              {imagesLeft} more image{imagesLeft > 1 ? 's' : ''} needed
            </div>
          )}
          {selectedFiles.length > 9 && (
            <div className="text-red-500 text-sm mb-2">
              Please remove {selectedFiles.length - 9} image{selectedFiles.length - 9 > 1 ? 's' : ''}.
            </div>
          )}
          <Button onClick={handleFileSelect} disabled={uploading || selectedFiles.length >= 9} >
            {uploading ? 'Uploading...' : (selectedFiles.length === 0 ? 'Select Images' : 'Add More Images')}
          </Button>
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xs sm:max-w-full mx-auto">
                {['tl', 'tr', 'bl', 'br'].map(q => (
                  <div key={q} className="border rounded p-2 flex flex-col items-center">
                    <div className="font-bold mb-2">{q.toUpperCase()}</div>
                    <div className="flex flex-col gap-2">
                      <SlotPreview
                        label="Header"
                        file={assignments[`header-${q}`]}
                        onClick={() => openFilePicker(`header-${q}`)}
                      />
                      <SlotPreview
                        label="Main"
                        file={assignments.main}
                        onClick={() => openFilePicker('main')}
                      />
                      <SlotPreview
                        label="Footer"
                        file={assignments[`footer-${q}`]}
                        onClick={() => openFilePicker(`footer-${q}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {selectedFiles.map(file => (
                  <Image
                    key={file.name}
                    src={URL.createObjectURL(file)}
                    className="object-cover border cursor-pointer rounded w-10 h-10 sm:w-12 sm:h-12"
                    onClick={() => assignToCurrentSlot(file)}
                    width={40}
                    height={40}
                    alt='preview'
                  />
                ))}
              </div>

              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              {selectedFiles.length === 9 && (
                <Button
                  className="mt-2"
                  onClick={handleUpload}
                  disabled={uploading || !allSlotsAssigned}
                >
                  {uploading ? 'Processing Images...' : 'Process Images'}
                </Button>
              )}
            </div>
          )}
          {error && selectedFiles.length === 0 && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          {slotToAssign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
              <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
                <div className="mb-2 font-bold text-gray-700">
                  Assign image to <span className="text-blue-600">{slots.find(s => s.key === slotToAssign)?.label}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedFiles.map(file => (
                    <Image
                      key={file.name}
                      src={URL.createObjectURL(file)}
                      className="object-cover border cursor-pointer rounded w-12 h-12 sm:w-16 sm:h-16"
                      onClick={() => assignToSlot(file)}
                      width={48}
                      height={48}
                      alt='preview'
                    />
                  ))}
                </div>
                <Button className="mt-4" onClick={() => setSlotToAssign(null)}>Cancel</Button>
              </div>
            </div>
          )}
          {/* Tutorial Modal */}
          {showTutorial && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
              <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">How to Assign Images to Quadrants</h2>
                {/* Animated Lucide icon dropping into a dashed area */}
                <div className="mb-4 w-[180px] h-[100px] sm:w-[220px] sm:h-[120px] relative flex items-center justify-center">
                  <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="60" y="60" width="100" height="50" rx="10" fill="#F3F4F6" stroke="#60A5FA" strokeDasharray="6 4" strokeWidth="2"/>
                      <text x="110" y="90" textAnchor="middle" fontSize="10" fill="#60A5FA">Drop image here</text>
                    </svg>
                  </div>
                  <div
                    className="absolute left-0 w-full flex justify-center"
                    style={{
                      animation: 'dropImageAnim 1.5s infinite',
                      top: 0,
                    }}
                  >
                    <LucideImage size={40} color="#60A5FA" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e0e7ef' }} />
                  </div>
                  <style>{`
                    @keyframes dropImageAnim {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(30px); }
                      100% { transform: translateY(0); }
                    }
                  `}</style>
                </div>
                <ul className="text-left text-gray-700 mb-4 list-disc pl-5">
                  <li>Click on a quadrant (Header, Main, Footer) to select it.</li>
                  <li>Choose an image from your uploaded images to assign it to that slot.</li>
                  <li>Repeat for all quadrants until each one is filled.</li>
                </ul>
                <Button
                  onClick={() => setShowTutorial(false)}
                >
                  Got it!
                </Button>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            On some mobile devices, you may need to select images one at a time. Keep clicking <span>Add More Images&quot;</span> until you have 9.
          </p>
        </>
      )}
    </div>
  );
}

