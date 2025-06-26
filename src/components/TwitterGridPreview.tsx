'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProcessedImage } from '@/lib/imageProcessor';

const cartoonAvatar =
  'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="%23F9D423"/><ellipse cx="20" cy="25" rx="10" ry="7" fill="%23fff"/><ellipse cx="14" cy="18" rx="3" ry="4" fill="%23000"/><ellipse cx="26" cy="18" rx="3" ry="4" fill="%23000"/><ellipse cx="14" cy="19" rx="1" ry="1.5" fill="%23fff"/><ellipse cx="26" cy="19" rx="1" ry="1.5" fill="%23fff"/><ellipse cx="20" cy="28" rx="4" ry="2" fill="%23F76B1C"/></svg>';

type Props = {
  images: string[]; // Array of image URLs
  processedImages?: ProcessedImage[]; // Array of processed images with blobs for download
  user?: {
    name: string;
    username: string;
    avatarUrl: string;
    time: string;
  };
  onBack?: () => void;
  onConvertAnother?: () => void;
};

const defaultUser = {
  name: 'Teyim Asobo',
  username: 'asofex',
  avatarUrl: cartoonAvatar,
  link:"https://x.com/asofex",
  time: '2h',
};

export default function TwitterGridPreview({ images, processedImages, user = defaultUser, onConvertAnother }: Props) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const handleDownload = (index: number) => {
    if (processedImages && processedImages[index]) {
      // Create download link for blob
      const url = URL.createObjectURL(processedImages[index].blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `twitter-grid-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Fallback to direct URL download
      const a = document.createElement('a');
      a.href = images[index];
      a.download = `twitter-grid-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-lg p-2 sm:p-4">
      {/* Fake Twitter header */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={user.avatarUrl}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
        <div>
          <div className="font-semibold">{user.name}</div>
          <a className="text-blue-400 text-sm" href={defaultUser.link}>@{user.username} · <span className='text-gray-700'>{user.time}</span></a>
        </div>
      </div>
      {/* Fake tweet text */}
      <div className="mb-3 text-gray-800 text-left px-2">
        <p>Here is what your tweet will look like to followers</p>
      </div>
      {/* 2x2 grid */}
      <div
        className="relative w-full max-w-[616px] aspect-[16/9] mx-auto rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[3px] sm:gap-[5px] w-full h-full">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative w-full h-full cursor-pointer transition duration-200 hover:brightness-75"
              onClick={() => setModalIndex(i)}
              title="Click to preview"
            >
              <Image
                src={url}
                alt={`Grid part ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 50vw, 308px"
                className="rounded"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Download links */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {images.map((url, i) => (
          <Button variant="outline" size="sm" key={i} onClick={() => handleDownload(i)}>
            Download Image {i + 1}
          </Button>
        ))}
      </div>
      {/* Navigation buttons */}
      <div className="flex gap-2 mt-6 justify-center flex-wrap">
        <Button variant="secondary" onClick={onConvertAnother}>Convert Another Image Grid</Button>
      </div>
      {modalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2" onClick={() => setModalIndex(null)}>
          <div
            className="bg-white rounded-lg shadow-lg p-2 sm:p-4 max-w-full max-h-full flex flex-col items-center"
            style={{ width: '100%', maxWidth: 600 }}
            onClick={e => e.stopPropagation()}
          >
            <p className='font-mono mb-2'>Image number: <span className='font-bold'>{modalIndex+1}</span></p>
            <div className="w-full flex justify-center">
              <Image
                src={typeof images[modalIndex] === 'string' ? images[modalIndex] : images[modalIndex]}
                alt={`Preview ${modalIndex + 1}`}
                width={600}
                height={1012}
                className="object-contain rounded max-h-[60vh] w-auto h-auto"
                style={{ maxWidth: '100%' }}
              />
            </div>
            <Button
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
              onClick={() => setModalIndex(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
