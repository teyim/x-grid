'use client';

import { useEffect, useState } from 'react';
import { normalizeImageFile } from '@/lib/imageFiles';
import { cn } from '@/lib/utils';

type SlotPreviewProps = {
  label: string;
  file: File | null;
  onClick: () => void;
  className?: string;
  emptyLabel?: string;
};

export default function SlotPreview({
  label,
  file,
  onClick,
  className,
  emptyLabel = 'Click to assign',
}: SlotPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function createPreview() {
      if (!file) {
        setPreviewUrl(null);
        return;
      }

      try {
        const previewBlob = await normalizeImageFile(file);
        objectUrl = URL.createObjectURL(previewBlob);

        if (active) {
          setPreviewUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        if (active) setPreviewUrl(null);
      }
    }

    createPreview();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <button
      type="button"
      className={cn(
        'flex aspect-square w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded border bg-gray-50 p-2 text-center hover:bg-blue-50',
        className
      )}
      onClick={onClick}
    >
      <span className="max-w-full truncate text-xs text-gray-500">{label}</span>
      {file ? (
        previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            className="mt-1 h-10 w-10 rounded object-cover"
            alt="selected image preview"
          />
        ) : (
          <span className="mt-1 max-w-full truncate text-xs leading-4 text-gray-400">{file.name}</span>
        )
      ) : (
        <span className="mt-1 text-xs leading-4 text-gray-400">{emptyLabel}</span>
      )}
    </button>
  );
}
