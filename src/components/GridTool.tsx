'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Download,
  Grid2X2,
  Grid3X3,
  HelpCircle,
  Images,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Sparkles,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SlotPreview from './SlotPreview';
import { ClientImageProcessor, ImageAssignments, ProcessedImage } from '@/lib/imageProcessor';
import { cn } from '@/lib/utils';
import {
  FitMode,
  GRID_MODES,
  GridMode,
  GridModeId,
  GridPlatform,
  getFilename,
  getGridMode,
} from '@/lib/gridModes';

const customSlots = [
  { key: 'main', label: 'Main image' },
  { key: 'header-tl', label: 'Header TL' },
  { key: 'header-tr', label: 'Header TR' },
  { key: 'header-bl', label: 'Header BL' },
  { key: 'header-br', label: 'Header BR' },
  { key: 'footer-tl', label: 'Footer TL' },
  { key: 'footer-tr', label: 'Footer TR' },
  { key: 'footer-bl', label: 'Footer BL' },
  { key: 'footer-br', label: 'Footer BR' },
];

type GridToolProps = {
  initialMode?: GridModeId;
  allowedModes?: GridModeId[];
};

export default function GridTool({
  initialMode = 'x-single',
  allowedModes,
}: GridToolProps) {
  const modes = useMemo(
    () => (allowedModes ? allowedModes.map(getGridMode) : GRID_MODES),
    [allowedModes]
  );
  const [modeId, setModeId] = useState<GridModeId>(initialMode);
  const [fit, setFit] = useState<FitMode>('cover');
  const [file, setFile] = useState<File | null>(null);
  const [customFiles, setCustomFiles] = useState<File[]>([]);
  const [slotToAssign, setSlotToAssign] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<{ [slot: string]: File | null }>(
    Object.fromEntries(customSlots.map((slot) => [slot.key, null]))
  );
  const [processedImages, setProcessedImages] = useState<ProcessedImage[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutorialModeId, setTutorialModeId] = useState<GridModeId | null>(null);

  const mode = getGridMode(modeId);
  const activePlatform = mode.platform;
  const hasMultiplePlatforms = new Set(modes.map((item) => item.platform)).size > 1;
  const visibleModes = hasMultiplePlatforms
    ? modes.filter((item) => item.platform === activePlatform)
    : modes;
  const allSlotsAssigned = Object.values(assignments).every(Boolean);

  const selectMode = (nextMode: GridMode) => {
    setModeId(nextMode.id);
    setFile(null);
    setCustomFiles([]);
    setSlotToAssign(null);
    setAssignments(Object.fromEntries(customSlots.map((slot) => [slot.key, null])));
    setProcessedImages(null);
    setError(null);
  };

  const selectPlatform = (platform: GridPlatform) => {
    const firstMode = modes.find((item) => item.platform === platform);

    if (firstMode && firstMode.id !== mode.id) {
      selectMode(firstMode);
    }
  };

  const selectSingleFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files?.[0]) {
        setFile(files[0]);
        setProcessedImages(null);
        setError(null);
      }
    };
    input.click();
  };

  const selectCustomFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const uniqueFiles = Array.from(
          new Map([...customFiles, ...Array.from(files)].map((item) => [item.name, item])).values()
        ).slice(0, 9);
        setCustomFiles(uniqueFiles);
        setProcessedImages(null);
        setError(uniqueFiles.length === 9 ? null : `Add ${9 - uniqueFiles.length} more image${9 - uniqueFiles.length === 1 ? '' : 's'}.`);
      }
    };
    input.click();
  };

  const assignToSlot = (selectedFile: File) => {
    if (!slotToAssign) return;
    setAssignments((current) => ({ ...current, [slotToAssign]: selectedFile }));
    setSlotToAssign(null);
    setError(null);
  };

  const processImages = async () => {
    setProcessing(true);
    setError(null);

    try {
      const processor = new ClientImageProcessor();
      let results: ProcessedImage[];

      if (mode.id === 'x-custom') {
        if (customFiles.length !== 9 || !allSlotsAssigned) {
          throw new Error('Select 9 images and assign every custom grid slot.');
        }

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

        results = await processor.processImages(imageAssignments);
      } else {
        if (!file) {
          throw new Error('Select an image first.');
        }

        results = await processor.splitImageByMode(file, mode, fit);
      }

      processor.dispose();
      setProcessedImages(results);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to process image.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (image: ProcessedImage, index: number) => {
    const url = URL.createObjectURL(image.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getFilename(mode, index);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    processedImages?.forEach((image, index) => {
      window.setTimeout(() => downloadImage(image, index), index * 180);
    });
  };

  const reset = () => {
    setFile(null);
    setCustomFiles([]);
    setAssignments(Object.fromEntries(customSlots.map((slot) => [slot.key, null])));
    setProcessedImages(null);
    setError(null);
  };

  return (
    <section
      id="tool"
      className="grid min-w-0 gap-4 rounded-lg border bg-white p-3 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]"
    >
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <div className="rounded-md bg-zinc-50 p-3">
          <p className="text-sm font-semibold text-zinc-950">Create a social media grid</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Choose where you want to post, upload an image, then download the generated tiles.
          </p>
        </div>

        {hasMultiplePlatforms && (
          <ToolStep label="1" title="Choose platform">
            <PlatformSwitcher activePlatform={activePlatform} onSelect={selectPlatform} />
          </ToolStep>
        )}

        <ToolStep label={hasMultiplePlatforms ? '2' : '1'} title="Choose format">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {visibleModes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => selectMode(item)}
                className={cn(
                  'rounded-md border p-3 text-left transition hover:border-zinc-400',
                  mode.id === item.id
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                )}
              >
                <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                  {item.previewType === 'instagram-profile' ? (
                    <Grid3X3 className="size-4 shrink-0" />
                  ) : item.previewType === 'instagram-carousel' ? (
                    <Images className="size-4 shrink-0" />
                  ) : (
                    <Grid2X2 className="size-4 shrink-0" />
                  )}
                  <span className="truncate">{item.shortLabel}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2 rounded-md bg-zinc-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-zinc-600">{mode.description}</p>
            <button
              type="button"
              onClick={() => setTutorialModeId(mode.id)}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-emerald-700"
            >
              <HelpCircle className="size-3.5" />
              How it works
            </button>
          </div>
        </ToolStep>

        <ToolStep label={hasMultiplePlatforms ? '3' : '2'} title="Upload image">
          {mode.id !== 'x-custom' && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-700">Crop</p>
                <div className="grid grid-cols-2 rounded-md border bg-white p-1">
                  {(['cover', 'contain'] as FitMode[]).map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFit(item)}
                      className={cn(
                        'rounded px-3 py-1 text-xs font-semibold capitalize',
                        fit === item ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={selectSingleFile} variant="outline" className="w-full min-w-0 justify-start bg-white">
                <Upload className="size-4 shrink-0" />
                <span className="min-w-0 truncate">{file ? file.name : mode.uploadLabel}</span>
              </Button>
            </div>
          )}

          {mode.id === 'x-custom' && (
            <CustomGridForm
              files={customFiles}
              assignments={assignments}
              slotToAssign={slotToAssign}
              onSelectFiles={selectCustomFiles}
              onOpenSlot={setSlotToAssign}
              onAssign={assignToSlot}
              onCloseSlot={() => setSlotToAssign(null)}
            />
          )}
        </ToolStep>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={processImages}
            disabled={processing || (mode.id === 'x-custom' ? !allSlotsAssigned || customFiles.length !== 9 : !file)}
            className="flex-1"
          >
            {processing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {processing ? 'Processing...' : mode.actionLabel}
          </Button>
          <Button variant="secondary" onClick={reset} disabled={processing}>
            <RefreshCcw className="size-4" />
            Reset
          </Button>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <p className="text-xs leading-5 text-zinc-500">
          {mode.inputHint} Images stay on your device.
        </p>
      </div>

      <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2 sm:p-4">
        <GridResultPreview mode={mode} images={processedImages} />
        {processedImages && (
          <div className="mt-4 space-y-3">
            <Button className="w-full" onClick={downloadAll}>
              <Download className="size-4" />
              Download all images
            </Button>
            <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-3">
              {processedImages.map((image, index) => (
                <Button
                  key={image.url}
                  variant="outline"
                  size="sm"
                  onClick={() => downloadImage(image, index)}
                  className="min-w-0 justify-start"
                >
                  <span className="min-w-0 truncate">{getFilename(mode, index)}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {tutorialModeId && (
        <ModeTutorialModal
          mode={getGridMode(tutorialModeId)}
          onClose={() => setTutorialModeId(null)}
        />
      )}
    </section>
  );
}

type CustomGridFormProps = {
  files: File[];
  assignments: { [slot: string]: File | null };
  slotToAssign: string | null;
  onSelectFiles: () => void;
  onOpenSlot: (slot: string) => void;
  onAssign: (file: File) => void;
  onCloseSlot: () => void;
};

function ToolStep({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
          {label}
        </span>
        <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PlatformSwitcher({
  activePlatform,
  onSelect,
}: {
  activePlatform: GridPlatform;
  onSelect: (platform: GridPlatform) => void;
}) {
  const options: {
    platform: GridPlatform;
    label: string;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      platform: 'x',
      label: 'X / Twitter',
      description: '2x2 posts and grid illusions',
      icon: Grid2X2,
    },
    {
      platform: 'instagram',
      label: 'Instagram',
      description: '3x3 grids and carousel tiles',
      icon: Images,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 min-[420px]:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const active = activePlatform === option.platform;

        return (
          <button
            type="button"
            key={option.platform}
            onClick={() => onSelect(option.platform)}
            className={cn(
              'flex min-w-0 items-center gap-3 rounded-md border p-3 text-left transition',
              active
                ? 'border-zinc-950 bg-white shadow-sm'
                : 'border-transparent text-zinc-600 hover:bg-white'
            )}
            aria-pressed={active}
          >
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-md',
                active ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-700'
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-zinc-950">
                {option.label}
              </span>
              <span className="mt-0.5 block truncate text-xs text-zinc-500">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ModeTutorialModal({
  mode,
  onClose,
}: {
  mode: GridMode;
  onClose: () => void;
}) {
  const isCustom = mode.id === 'x-custom';
  const steps = getTutorialSteps(mode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Quick guide
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-950">{mode.label}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Close tutorial"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-4">
          <TutorialAnimation mode={mode} />
          <ol className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-zinc-700">{step}</p>
              </li>
            ))}
          </ol>
          {isCustom && (
            <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              Tip: the Main image is shared across the four X preview tiles. Headers and footers become the tall images people see when they open each tile.
            </p>
          )}
          <Button className="mt-4 w-full" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

function TutorialAnimation({ mode }: { mode: GridMode }) {
  const tileCount = mode.id === 'instagram-grid' ? 9 : mode.id === 'x-custom' ? 4 : mode.outputCount;
  const columns = mode.id === 'instagram-grid' ? 3 : mode.id === 'instagram-carousel' ? 4 : 2;

  return (
    <div className="relative overflow-hidden rounded-lg border bg-zinc-50 p-4">
      <div className="mx-auto flex max-w-xs items-center justify-center gap-4">
        <div className="flex size-14 shrink-0 animate-[tutorialPulse_1.8s_ease-in-out_infinite] items-center justify-center rounded-md border bg-white text-emerald-700 shadow-sm">
          <Upload className="size-6" />
        </div>
        <div className="flex items-center text-zinc-400">
          <MousePointerClick className="size-5 animate-[tutorialTap_1.8s_ease-in-out_infinite]" />
        </div>
        <div
          className="grid w-28 gap-1"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: tileCount }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded bg-zinc-950 animate-[tutorialTile_1.8s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes tutorialPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes tutorialTap {
          0%, 100% { transform: translateX(0); opacity: 0.55; }
          50% { transform: translateX(8px); opacity: 1; }
        }
        @keyframes tutorialTile {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

function getTutorialSteps(mode: GridMode) {
  if (mode.id === 'x-custom') {
    return [
      'Select exactly 9 images.',
      'Assign the shared Main image once.',
      'Tap each Header and Footer slot, then choose one uploaded image.',
      'When every slot is filled, create and download the 4 X grid images.',
    ];
  }

  if (mode.id === 'instagram-grid') {
    return [
      'Upload one image you want to spread across your profile.',
      'Choose cover to fill the squares or contain to keep the full image visible.',
      'Download the 9 tiles.',
      'Post tile 09 first and tile 01 last so the profile grid lines up.',
    ];
  }

  if (mode.id === 'instagram-carousel') {
    return [
      'Upload one wide image or design.',
      'Choose cover or contain based on how much cropping you want.',
      'Download the square carousel slides.',
      'Upload them to Instagram from 01 to the last tile.',
    ];
  }

  return [
    'Upload one image for your X/Twitter post.',
    'Choose cover to fill the post grid or contain to avoid cropping.',
    'Preview the 2x2 layout.',
    'Download all 4 images and attach them to one post.',
  ];
}

function CustomGridForm({
  files,
  assignments,
  slotToAssign,
  onSelectFiles,
  onOpenSlot,
  onAssign,
  onCloseSlot,
}: CustomGridFormProps) {
  const assignedCount = Object.values(assignments).filter(Boolean).length;
  const progress = Math.round((assignedCount / customSlots.length) * 100);
  const slotLabel = slotToAssign
    ? customSlots.find((slot) => slot.key === slotToAssign)?.label || slotToAssign
    : '';

  return (
    <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="space-y-3">
        <Button onClick={onSelectFiles} variant="outline" className="w-full min-w-0 justify-start bg-white">
          <Upload className="size-4 shrink-0" />
          <span className="min-w-0 truncate">
            {files.length ? `${files.length}/9 images selected` : 'Select 9 images'}
          </span>
        </Button>
        <div className="rounded-md bg-white p-3">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-zinc-600">
            <span>{assignedCount}/9 slots assigned</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Tap a slot below, then choose one uploaded image from the popup.
          </p>
        </div>
        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {files.map((item, index) => (
              <div key={item.name} className="relative size-12 shrink-0 overflow-hidden rounded border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(item)} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[9px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-md border bg-white p-3">
        <p className="mb-2 text-xs font-bold uppercase text-zinc-600">Shared main image</p>
        <SlotPreview
          label="Main"
          file={assignments.main}
          onClick={() => onOpenSlot('main')}
          className="mx-auto max-w-36"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {['tl', 'tr', 'bl', 'br'].map((quadrant) => (
          <div key={quadrant} className="min-w-0 rounded-md border bg-white p-2">
            <p className="mb-2 text-center text-xs font-bold uppercase text-zinc-600">
              {quadrant}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <SlotPreview
                label="Header"
                file={assignments[`header-${quadrant}`]}
                onClick={() => onOpenSlot(`header-${quadrant}`)}
              />
              <SlotPreview
                label="Footer"
                file={assignments[`footer-${quadrant}`]}
                onClick={() => onOpenSlot(`footer-${quadrant}`)}
              />
            </div>
          </div>
        ))}
      </div>
      {slotToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
            <p className="truncate font-semibold text-zinc-900">Assign image to {slotLabel}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 min-[360px]:grid-cols-4 sm:grid-cols-5">
              {files.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => onAssign(item)}
                  className="aspect-square overflow-hidden rounded border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(item)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <Button className="mt-4" variant="secondary" onClick={onCloseSlot}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function GridResultPreview({
  mode,
  images,
}: {
  mode: GridMode;
  images: ProcessedImage[] | null;
}) {
  if (!images) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed bg-white p-4 text-center sm:min-h-[340px] sm:p-6">
        <div className="flex size-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
          {mode.previewType === 'instagram-profile' ? <Grid3X3 /> : <Images />}
        </div>
        <p className="mt-4 text-sm font-semibold text-zinc-950">Preview appears here</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
          Process an image to check ordering, cropping, and platform layout before downloading.
        </p>
      </div>
    );
  }

  if (mode.previewType === 'instagram-profile') {
    return (
      <div className="min-w-0">
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-md bg-white p-1">
          {images.map((image, index) => (
            <PreviewImage key={image.url} image={image} index={index} className="aspect-square" />
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Instagram profile grids appear newest-first. Upload tile 09 first and tile 01 last.
        </p>
      </div>
    );
  }

  if (mode.previewType === 'instagram-carousel') {
    return (
      <div className="min-w-0">
        <div className="flex snap-x gap-2 overflow-x-auto rounded-md bg-white p-2">
          {images.map((image, index) => (
            <PreviewImage
              key={image.url}
              image={image}
              index={index}
              className="aspect-square min-w-[72%] snap-start min-[420px]:min-w-[46%] sm:min-w-[31%]"
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Carousel tiles are ordered left to right. Upload them from 01 to {String(images.length).padStart(2, '0')}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-xl bg-white p-2 shadow-sm sm:p-3">
      <div className="mb-3 flex items-center gap-3">
        <div className="size-9 shrink-0 rounded-full bg-zinc-950 sm:size-10" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-950">Your post preview</p>
          <p className="text-xs text-zinc-500">@yourhandle · now</p>
        </div>
      </div>
      <p className="mb-3 text-sm text-zinc-700">Here is how the X grid will look in the feed.</p>
      <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-zinc-200">
        {images.map((image, index) => (
          <PreviewImage key={image.url} image={image} index={index} className="h-full w-full" />
        ))}
      </div>
    </div>
  );
}

function PreviewImage({
  image,
  index,
  className,
}: {
  image: ProcessedImage;
  index: number;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-zinc-100', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={`Grid tile ${index + 1}`}
        className="h-full w-full object-cover"
      />
      <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
}
