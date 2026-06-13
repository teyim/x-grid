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
        'relative flex aspect-square w-full min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded border bg-gray-50 p-2 text-center transition hover:border-blue-300 hover:bg-blue-50',
        className
      )}
      onClick={onClick}
    >
      {file && previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            className="absolute inset-0 h-full w-full object-cover"
            alt="selected image preview"
          />
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-zinc-900 shadow-sm">
            {label}
          </span>
          <span className="absolute inset-x-0 bottom-0 truncate bg-zinc-950/70 px-2 py-1.5 text-[11px] font-medium text-white">
            {file.name}
          </span>
        </>
      ) : (
        <>
          <span className="max-w-full truncate text-xs font-semibold text-gray-600">{label}</span>
          {file ? (
            <span className="mt-1 max-w-full truncate text-xs leading-4 text-gray-400">
              {file.name}
            </span>
          ) : (
            <span className="mt-1 text-xs leading-4 text-gray-400">{emptyLabel}</span>
          )}
        </>
      )}
    </button>
  );
}
