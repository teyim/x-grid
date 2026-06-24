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
  loadingLabel?: string;
};

export default function SlotPreview({
  label,
  file,
  onClick,
  className,
  emptyLabel = 'Click to assign',
  loadingLabel = 'Loading preview...',
}: SlotPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function createPreview() {
      if (!file) {
        setPreviewUrl(null);
        setIsLoading(false);
        return;
      }

      setPreviewUrl(null);
      setIsLoading(true);

      try {
        const previewBlob = await normalizeImageFile(file);
        objectUrl = URL.createObjectURL(previewBlob);

        if (active) {
          setPreviewUrl(objectUrl);
          setIsLoading(false);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        if (active) {
          setPreviewUrl(null);
          setIsLoading(false);
        }
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
        'relative flex aspect-square w-full min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white p-2 text-center shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
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
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-zinc-900 shadow-sm">
            {label}
          </span>
          <span className="absolute inset-x-0 bottom-0 truncate bg-zinc-950/70 px-2 py-1.5 text-[11px] font-medium text-white">
            {file.name}
          </span>
        </>
      ) : (
        <>
          <span className="flex size-9 items-center justify-center rounded-md bg-zinc-100 text-xs font-black text-zinc-500">
            +
          </span>
          <span className="mt-2 max-w-full truncate text-xs font-bold text-zinc-700">{label}</span>
          {file && isLoading ? (
            <>
              <span className="mt-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600" />
              <span className="mt-2 max-w-full truncate text-xs font-semibold leading-4 text-zinc-700">
                {loadingLabel}
              </span>
              <span className="mt-1 max-w-full truncate text-[11px] leading-4 text-gray-400">
                {file.name}
              </span>
            </>
          ) : file ? (
            <>
              <span className="mt-1 max-w-full truncate text-xs leading-4 text-gray-400">
                {file.name}
              </span>
            </>
          ) : (
            <span className="mt-1 text-xs leading-4 text-zinc-400">{emptyLabel}</span>
          )}
        </>
      )}
    </button>
  );
}
