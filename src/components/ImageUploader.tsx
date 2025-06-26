'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import SlotPreview from './SlotPreview';
import Image from 'next/image';
import { Image as LucideImage } from 'lucide-react';

function sanitizeFileName(filename: string): string {
  // Remove or replace problematic characters
  return filename
    .normalize('NFKD') // Remove accents/diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace all non-safe chars with _
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_+|_+$/g, '') // Trim underscores at start/end
    .toLowerCase();
}

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

export default function ImageUploader({ onUploadComplete }: { onUploadComplete: (jobId: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slotToAssign, setSlotToAssign] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialShown, setTutorialShown] = useState(false);

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
      const { data: jobData, error: jobError } = await supabase
        .from('processing_jobs')
        .insert([{}])
        .select('id')
        .single();
      if (jobError || !jobData) throw jobError || new Error('Failed to create job.');
      const jobId = jobData.id;
      const uploadPromises = selectedFiles.map(file => {
        const safeName = sanitizeFileName(file.name);
        const filePath = `${jobId}/${safeName}`;
        return supabase.storage.from('raw-uploads').upload(filePath, file);
      });
      const uploadResults = await Promise.all(uploadPromises);
      const uploadErrors = uploadResults.filter(result => result.error);
      if (uploadErrors.length > 0) {
        throw new Error(`Failed to upload files: ${uploadErrors.map(e => e.error?.message).join(', ')}`);
      }
      const filePaths = uploadResults.map(result => result.data?.path).filter((p): p is string => !!p);
      const { error: updateError } = await supabase
        .from('processing_jobs')
        .update({ raw_files: filePaths })
        .eq('id', jobId);
      if (updateError) throw updateError;

      // Build assignments mapping: { slot: sanitized file name }
      const assignmentsMap: { [slot: string]: string } = {};
      for (const slot of Object.keys(assignments)) {
        const file = assignments[slot];
        if (file) {
          assignmentsMap[slot] = sanitizeFileName(file.name);
        }
      }

      const response = await fetch('/api/process-twitter-grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, assignments: assignmentsMap })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to trigger processing.');
      }
      onUploadComplete(jobId);
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

  return (
    <div className="w-full max-w-lg mx-auto p-8 border-2 border-dashed rounded-lg text-center">
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
      <Button onClick={handleFileSelect} disabled={uploading || selectedFiles.length === 9} >
        {uploading ? 'Uploading...' : 'Select Images'}
      </Button>
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex gap-2 mt-4">
            {selectedFiles.map(file => (
              <Image
                key={file.name}
                src={URL.createObjectURL(file)}
                className=" object-cover border cursor-pointer"
                onClick={() => assignToCurrentSlot(file)}
                width={30}
                height={30}
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
              Upload Images
            </Button>
          )}
        </div>
      )}
      {error && selectedFiles.length === 0 && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      {slotToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-2 font-bold text-gray-700">
              Assign image to <span className="text-blue-600">{slots.find(s => s.key === slotToAssign)?.label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map(file => (
                <Image
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  className=" object-cover border cursor-pointer rounded"
                  onClick={() => assignToSlot(file)}
                  width={40}
                  height={40}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">How to Assign Images to Quadrants</h2>
            {/* Animated Lucide icon dropping into a dashed area */}
            <div className="mb-4 w-[220px] h-[120px] relative flex items-center justify-center">
              <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="60" y="60" width="100" height="50" rx="10" fill="#F3F4F6" stroke="#60A5FA" strokeDasharray="6 4" strokeWidth="2"/>
                  <text x="110" y="90" textAnchor="middle" fontSize="10" fill="#60A5FA" className=''>Drop image here</text>
                </svg>
              </div>
              <div
                className="absolute left-0 w-full flex justify-center"
                style={{
                  animation: 'dropImageAnim 1.5s infinite',
                  top: 0,
                }}
              >
                <LucideImage size={48} color="#60A5FA" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e0e7ef' }} />
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
    </div>
  );
}

