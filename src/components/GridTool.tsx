'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Download,
  Eye,
  Grid2X2,
  Grid3X3,
  HelpCircle,
  ImagePlus,
  Images,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
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
import { useI18n } from '@/lib/i18n';

const customSlots = [
  { key: 'main' },
  { key: 'header-tl' },
  { key: 'header-tr' },
  { key: 'header-bl' },
  { key: 'header-br' },
  { key: 'footer-tl' },
  { key: 'footer-tr' },
  { key: 'footer-bl' },
  { key: 'footer-br' },
];

const imageAccept = 'image/*,.heic,.heif';
const sampleImages = {
  landscape: '/samples/social-grid-landscape.jpg',
  carousel: '/samples/social-grid-carousel.jpg',
};

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
  const [assignments, setAssignments] = useState<{ [slot: string]: File | null }>(
    Object.fromEntries(customSlots.map((slot) => [slot.key, null]))
  );
  const [processedImages, setProcessedImages] = useState<ProcessedImage[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutorialModeId, setTutorialModeId] = useState<GridModeId | null>(null);
  const [lookModeId, setLookModeId] = useState<GridModeId | null>(null);
  const { t } = useI18n();
  const posthog = usePostHog();

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
    input.accept = imageAccept;
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
    input.accept = imageAccept;
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const uniqueFiles = Array.from(
          new Map([...customFiles, ...Array.from(files)].map((item) => [item.name, item])).values()
        ).slice(0, 9);
        setCustomFiles(uniqueFiles);
        setAssignments((current) => {
          const next = { ...current };
          const emptySlots = customSlots
            .map((slot) => slot.key)
            .filter((slot) => !next[slot]);

          Array.from(files).slice(0, emptySlots.length).forEach((item, index) => {
            next[emptySlots[index]] = item;
          });

          return next;
        });
        setProcessedImages(null);
        setError(null);
      }
    };
    input.click();
  };

  const selectFileForSlot = (slot: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = imageAccept;
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      const selectedFile = files?.[0];

      if (!selectedFile) return;

      setCustomFiles((current) => {
        const next = new Map(current.map((item) => [item.name, item]));
        next.set(selectedFile.name, selectedFile);
        return Array.from(next.values()).slice(0, 9);
      });
      setAssignments((current) => ({ ...current, [slot]: selectedFile }));
      setProcessedImages(null);
      setError(null);
    };
    input.click();
  };

  const processImages = async () => {
    setProcessing(true);
    setError(null);

    try {
      const processor = new ClientImageProcessor();
      let results: ProcessedImage[];

      if (mode.id === 'x-custom') {
        if (!allSlotsAssigned) {
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
      posthog.capture('grid_created', {
        mode_id: mode.id,
        mode_label: mode.label,
        platform: mode.platform,
        tile_count: results.length,
        fit_mode: mode.id === 'x-custom' ? null : fit,
        selected_image_count: mode.id === 'x-custom' ? customFiles.length : 1,
      });
      recordUsageStats({
        platform: mode.platform,
        tileCount: results.length,
        inputImageCount: mode.id === 'x-custom' ? 9 : 1,
      });
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
          <p className="text-sm font-semibold text-zinc-950">{t('tool.title')}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {t('tool.subtitle')}
          </p>
        </div>

        {hasMultiplePlatforms && (
          <ToolStep label="1" title={t('tool.choosePlatform')}>
            <PlatformSwitcher activePlatform={activePlatform} onSelect={selectPlatform} />
          </ToolStep>
        )}

        <ToolStep label={hasMultiplePlatforms ? '2' : '1'} title={t('tool.chooseFormat')}>
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
                  <span className="truncate">{getModeLabel(item.id, t)}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2 rounded-md bg-zinc-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-zinc-600">{getModeDescription(mode.id, t)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTutorialModeId(mode.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm hover:border-emerald-300 hover:text-emerald-700"
              >
                <HelpCircle className="size-3.5" />
                {t('tool.how')}
              </button>
              <button
                type="button"
                onClick={() => setLookModeId(mode.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm hover:border-blue-300 hover:text-blue-700"
              >
                <Eye className="size-3.5" />
                {t('tool.howLook')}
              </button>
            </div>
          </div>
        </ToolStep>

        <ToolStep label={hasMultiplePlatforms ? '3' : '2'} title={t('tool.selectImage')}>
          {mode.id !== 'x-custom' && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-700">{t('tool.crop')}</p>
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
                      {item === 'cover' ? t('tool.cover') : t('tool.contain')}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={selectSingleFile} variant="outline" className="w-full min-w-0 justify-start bg-white">
                <ImagePlus className="size-4 shrink-0" />
                <span className="min-w-0 truncate">{file ? file.name : getSelectLabel(mode.id, t)}</span>
              </Button>
            </div>
          )}

          {mode.id === 'x-custom' && (
            <CustomGridForm
              files={customFiles}
              assignments={assignments}
              onSelectFiles={selectCustomFiles}
              onOpenSlot={selectFileForSlot}
            />
          )}
        </ToolStep>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={processImages}
            disabled={processing || (mode.id === 'x-custom' ? !allSlotsAssigned : !file)}
            className="flex-1"
          >
            {processing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {processing ? t('tool.processing') : getActionLabel(mode.id, t)}
          </Button>
          <Button variant="secondary" onClick={reset} disabled={processing}>
            <RefreshCcw className="size-4" />
            {t('tool.reset')}
          </Button>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <p className="text-xs leading-5 text-zinc-500">
          {getModeDescription(mode.id, t)} {t('tool.imagesPrivate')}
        </p>
      </div>

      <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2 sm:p-4">
        <GridResultPreview mode={mode} images={processedImages} />
        {processedImages && (
          <div className="mt-4 space-y-3">
            <Button className="w-full" onClick={downloadAll}>
              <Download className="size-4" />
              {t('tool.downloadAll')}
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

      {lookModeId && (
        <ModeLookPreviewModal
          mode={getGridMode(lookModeId)}
          onClose={() => setLookModeId(null)}
        />
      )}
    </section>
  );
}

function recordUsageStats(payload: {
  platform: GridPlatform;
  tileCount: number;
  inputImageCount: number;
}) {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        window.dispatchEvent(new Event('usage-stats-updated'));
      }
    })
    .catch((error) => {
      console.warn('Unable to record usage stats:', error);
    });
}

type CustomGridFormProps = {
  files: File[];
  assignments: { [slot: string]: File | null };
  onSelectFiles: () => void;
  onOpenSlot: (slot: string) => void;
};

function getModeLabel(modeId: GridModeId, t: ReturnType<typeof useI18n>['t']) {
  const labels: Record<GridModeId, ReturnType<typeof t>> = {
    'x-single': t('mode.xSingle'),
    'x-custom': t('mode.xCustom'),
    'instagram-grid': t('mode.igGrid'),
    'instagram-carousel': t('mode.igCarousel'),
  };

  return labels[modeId];
}

function getModeDescription(modeId: GridModeId, t: ReturnType<typeof useI18n>['t']) {
  const descriptions: Record<GridModeId, string> = {
    'x-single': t('mode.xSingleDesc'),
    'x-custom': t('mode.xCustomDesc'),
    'instagram-grid': t('mode.igGridDesc'),
    'instagram-carousel': t('mode.igCarouselDesc'),
  };

  return descriptions[modeId];
}

function getSelectLabel(modeId: GridModeId, t: ReturnType<typeof useI18n>['t']) {
  if (modeId === 'x-custom') return t('select.nine');
  if (modeId === 'instagram-carousel') return t('select.wide');
  return t('select.single');
}

function getActionLabel(modeId: GridModeId, t: ReturnType<typeof useI18n>['t']) {
  if (modeId === 'instagram-grid') return t('mode.igGrid');
  if (modeId === 'instagram-carousel') return t('mode.igCarousel');
  if (modeId === 'x-custom') return t('mode.xCustom');
  return t('tool.process');
}

function getQuadrantLabel(quadrant: string, t: ReturnType<typeof useI18n>['t']) {
  const labels: Record<string, string> = {
    tl: t('quadrant.tl'),
    tr: t('quadrant.tr'),
    bl: t('quadrant.bl'),
    br: t('quadrant.br'),
  };

  return labels[quadrant] || quadrant;
}

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
  const { t } = useI18n();
  const options: {
    platform: GridPlatform;
    label: string;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      platform: 'x',
      label: t('platform.x'),
      description: t('platform.xDesc'),
      icon: Grid2X2,
    },
    {
      platform: 'instagram',
      label: t('platform.instagram'),
      description: t('platform.instagramDesc'),
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
  const { t } = useI18n();
  const steps = getTutorialSteps(mode, t);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {t('tutorial.quickGuide')}
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-950">{getModeLabel(mode.id, t)}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            aria-label={t('tutorial.close')}
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
              {t('tutorial.customTip')}
            </p>
          )}
          <Button className="mt-4 w-full" onClick={onClose}>
            {t('tutorial.gotIt')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModeLookPreviewModal({
  mode,
  onClose,
}: {
  mode: GridMode;
  onClose: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              {t('look.title')}
            </p>
            <h2 className="mt-1 truncate text-lg font-bold text-zinc-950">{getModeLabel(mode.id, t)}</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{getLookDescription(mode.id, t)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            aria-label={t('look.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 overflow-auto p-4">
          <LookPreview mode={mode} />
          <Button className="mt-4 w-full" onClick={onClose}>
            {t('tutorial.gotIt')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getLookDescription(modeId: GridModeId, t: ReturnType<typeof useI18n>['t']) {
  const descriptions: Record<GridModeId, string> = {
    'x-single': t('look.xSingleDesc'),
    'x-custom': t('look.xCustomDesc'),
    'instagram-grid': t('look.igGridDesc'),
    'instagram-carousel': t('look.igCarouselDesc'),
  };

  return descriptions[modeId];
}

function LookPreview({ mode }: { mode: GridMode }) {
  if (mode.id === 'instagram-grid') return <InstagramGridLook />;
  if (mode.id === 'instagram-carousel') return <InstagramCarouselLook />;
  if (mode.id === 'x-custom') return <XCustomLook />;
  return <XSingleLook />;
}

function XSingleLook() {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-zinc-50 p-3">
      <XPostShell>
        <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-zinc-200">
          {Array.from({ length: 4 }).map((_, index) => (
            <PhotoSliceTile
              key={index}
              src={sampleImages.landscape}
              index={index}
              columns={2}
              rows={2}
              className="h-full w-full"
            />
          ))}
        </div>
      </XPostShell>
      <p className="mt-3 text-xs leading-5 text-zinc-600">{t('look.xSingleDesc')}</p>
    </div>
  );
}

function XCustomLook() {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const quadrants = ['tl', 'tr', 'bl', 'br'];
  const selectedQuadrant = quadrants[selectedIndex];

  return (
    <div className="rounded-xl border bg-zinc-50 p-3">
      <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold leading-5 text-emerald-800">
        {t('look.customPrompt')}
      </p>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.75fr)]">
        <XPostShell>
          <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-zinc-200">
            {quadrants.map((quadrant, index) => (
              <button
                type="button"
                key={quadrant}
                onClick={() => setSelectedIndex(index)}
                aria-label={`${t('look.openStack')} ${getQuadrantLabel(quadrant, t)}`}
                className={cn(
                  'relative min-h-24 overflow-hidden text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
                  selectedIndex === index ? 'ring-4 ring-emerald-500' : 'hover:brightness-95'
                )}
              >
                <PhotoSliceTile
                  src={sampleImages.landscape}
                  index={index}
                  columns={2}
                  rows={2}
                  className="h-full w-full"
                />
                <span className="absolute inset-x-2 bottom-2 truncate rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-zinc-950">
                  {getQuadrantLabel(quadrant, t)}
                </span>
              </button>
            ))}
          </div>
        </XPostShell>
        <StackedCardLook
          title={`${t('look.stackTitle')} ${getQuadrantLabel(selectedQuadrant, t)}`}
          index={selectedIndex}
        />
      </div>
    </div>
  );
}

function InstagramGridLook() {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-zinc-50 p-3">
      <div className="mx-auto max-w-md rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="size-10 rounded-full bg-zinc-950" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-950">socialgridtool</p>
            <p className="text-xs text-zinc-500">3x3 grid preview</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded bg-zinc-100 p-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <PhotoSliceTile
              key={index}
              src={sampleImages.landscape}
              index={index}
              columns={3}
              rows={3}
              className="aspect-square"
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-600">{t('preview.igGridOrder')}</p>
    </div>
  );
}

function InstagramCarouselLook() {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-zinc-50 p-3">
      <div className="flex snap-x gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm">
        {Array.from({ length: 4 }).map((_, index) => (
          <PhotoSliceTile
            key={index}
            src={sampleImages.carousel}
            index={index}
            columns={4}
            rows={1}
            className="aspect-square min-w-[78%] snap-start min-[420px]:min-w-[47%] sm:min-w-[32%]"
          />
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-600">
        {t('preview.carouselOrder', { count: '04' })}
      </p>
    </div>
  );
}

function XPostShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-w-0 rounded-xl bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="size-9 shrink-0 rounded-full bg-zinc-950" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-950">{t('preview.xTitle')}</p>
          <p className="text-xs text-zinc-500">{t('preview.xMeta')}</p>
        </div>
      </div>
      <p className="mb-3 text-sm text-zinc-700">{t('preview.xBody')}</p>
      {children}
    </div>
  );
}

function PhotoSliceTile({
  src,
  index,
  columns,
  rows,
  className,
}: {
  src: string;
  index: number;
  columns: number;
  rows: number;
  className?: string;
}) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = columns === 1 ? 50 : (column / (columns - 1)) * 100;
  const y = rows === 1 ? 50 : (row / (rows - 1)) * 100;

  return (
    <div
      className={cn('relative overflow-hidden bg-zinc-200 bg-no-repeat', className)}
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundSize: `${columns * 100}% ${rows * 100}%`,
      }}
    >
      <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
}

function StackedCardLook({
  title,
  index,
}: {
  title: string;
  index: number;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <p className="mb-3 text-sm font-bold text-zinc-950">{title}</p>
      <div className="mx-auto grid max-w-56 overflow-hidden rounded-lg border bg-zinc-100">
        <StackSection label={t('look.header')} className="h-24" index={index + 1} />
        <StackSection label={t('look.sharedMain')} className="h-36" index={index + 4} />
        <StackSection label={t('look.footer')} className="h-24" index={index + 5} />
      </div>
    </div>
  );
}

function StackSection({
  label,
  className,
  index,
}: {
  label: string;
  className: string;
  index: number;
}) {
  return (
    <div className={cn('relative overflow-hidden border-b last:border-b-0', className)}>
      <PhotoSliceTile
        src={sampleImages.landscape}
        index={index}
        columns={3}
        rows={3}
        className="h-full w-full"
      />
      <span className="absolute inset-x-2 bottom-2 truncate rounded bg-white/90 px-2 py-1 text-center text-[11px] font-bold text-zinc-950 shadow-sm">
        {label}
      </span>
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
          <ImagePlus className="size-6" />
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

function getTutorialSteps(mode: GridMode, t: ReturnType<typeof useI18n>['t']) {
  if (mode.id === 'x-custom') {
    return [
      t('tutorial.xCustom1'),
      t('tutorial.xCustom2'),
      t('tutorial.xCustom3'),
      t('tutorial.xCustom4'),
    ];
  }

  if (mode.id === 'instagram-grid') {
    return [
      t('tutorial.igGrid1'),
      t('tutorial.igGrid2'),
      t('tutorial.igGrid3'),
      t('tutorial.igGrid4'),
    ];
  }

  if (mode.id === 'instagram-carousel') {
    return [
      t('tutorial.igCarousel1'),
      t('tutorial.igCarousel2'),
      t('tutorial.igCarousel3'),
      t('tutorial.igCarousel4'),
    ];
  }

  return [
    t('tutorial.xSingle1'),
    t('tutorial.xSingle2'),
    t('tutorial.xSingle3'),
    t('tutorial.xSingle4'),
  ];
}

function CustomGridForm({
  files,
  assignments,
  onSelectFiles,
  onOpenSlot,
}: CustomGridFormProps) {
  const { t } = useI18n();
  const assignedCount = Object.values(assignments).filter(Boolean).length;
  const progress = Math.round((assignedCount / customSlots.length) * 100);

  return (
    <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="space-y-3">
        <Button onClick={onSelectFiles} variant="outline" className="w-full min-w-0 justify-start bg-white">
          <ImagePlus className="size-4 shrink-0" />
          <span className="min-w-0 truncate">
            {files.length ? `${files.length}/9 ${t('tool.selectImage')}` : t('select.nine')}
          </span>
        </Button>
        <div className="rounded-md bg-white p-3">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-zinc-600">
            <span>{t('custom.progress', { assigned: assignedCount })}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            {t('custom.tip')}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-800">
            {t('custom.directAssignTip')}
          </p>
        </div>
        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {files.map((item, index) => (
              <div key={`${item.name}-${index}`} className="min-w-24 max-w-36 shrink-0 rounded border bg-white px-2 py-1.5">
                <span className="block text-[10px] font-bold text-zinc-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block truncate text-xs font-medium text-zinc-800">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-md border bg-white p-3">
        <p className="mb-2 text-xs font-bold uppercase text-zinc-600">{t('custom.main')}</p>
        <SlotPreview
          label={t('custom.main')}
          file={assignments.main}
          onClick={() => onOpenSlot('main')}
          className="mx-auto max-w-64"
          emptyLabel={t('custom.clickAssign')}
          loadingLabel={t('custom.loadingPreview')}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {['tl', 'tr', 'bl', 'br'].map((quadrant) => (
          <div key={quadrant} className="min-w-0 rounded-md border bg-white p-2">
            <p className="mb-2 text-center text-xs font-bold uppercase text-zinc-600">
              {getQuadrantLabel(quadrant, t)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <SlotPreview
                label={t('custom.header')}
                file={assignments[`header-${quadrant}`]}
                onClick={() => onOpenSlot(`header-${quadrant}`)}
                className="min-h-36 sm:min-h-40"
                emptyLabel={t('custom.clickAssign')}
                loadingLabel={t('custom.loadingPreview')}
              />
              <SlotPreview
                label={t('custom.footer')}
                file={assignments[`footer-${quadrant}`]}
                onClick={() => onOpenSlot(`footer-${quadrant}`)}
                className="min-h-36 sm:min-h-40"
                emptyLabel={t('custom.clickAssign')}
                loadingLabel={t('custom.loadingPreview')}
              />
            </div>
          </div>
        ))}
      </div>
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
  const { t } = useI18n();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const selectedImage = selectedImageIndex !== null ? images?.[selectedImageIndex] : null;

  if (!images) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed bg-white p-4 text-center sm:min-h-[340px] sm:p-6">
        <div className="flex size-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
          {mode.previewType === 'instagram-profile' ? <Grid3X3 /> : <Images />}
        </div>
        <p className="mt-4 text-sm font-semibold text-zinc-950">{t('tool.preview')}</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
          {t('tool.previewHelp')}
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
          {t('preview.igGridOrder')}
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
          {t('preview.carouselOrder', { count: String(images.length).padStart(2, '0') })}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-w-0 rounded-xl bg-white p-2 shadow-sm sm:p-3">
        <div className="mb-3 flex items-center gap-3">
          <div className="size-9 shrink-0 rounded-full bg-zinc-950 sm:size-10" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">{t('preview.xTitle')}</p>
            <p className="text-xs text-zinc-500">{t('preview.xMeta')}</p>
          </div>
        </div>
        <p className="mb-3 text-sm text-zinc-700">{t('preview.xBody')}</p>
        {mode.id === 'x-custom' && (
          <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold leading-5 text-emerald-800">
            {t('preview.customRevealPrompt')}
          </p>
        )}
        <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-zinc-200">
          {images.map((image, index) => (
            <PreviewImage
              key={image.url}
              image={image}
              index={index}
              className="h-full w-full"
              onClick={mode.id === 'x-custom' ? () => setSelectedImageIndex(index) : undefined}
              ariaLabel={mode.id === 'x-custom' ? `${t('preview.openFull')} ${index + 1}` : undefined}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4">
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <p className="min-w-0 truncate text-sm font-semibold text-zinc-950">
                {t('preview.fullImage')} {String(selectedImageIndex! + 1).padStart(2, '0')}
              </p>
              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                aria-label={t('tutorial.close')}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 overflow-auto bg-zinc-100 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={`${t('preview.fullImage')} ${selectedImageIndex! + 1}`}
                className="mx-auto max-h-[78vh] w-auto max-w-full rounded bg-white object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PreviewImage({
  image,
  index,
  className,
  onClick,
  ariaLabel,
}: {
  image: ProcessedImage;
  index: number;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={`Grid tile ${index + 1}`}
        className="h-full w-full object-cover"
      />
      <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn('relative overflow-hidden bg-zinc-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600', className)}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-zinc-100', className)}>
      {content}
    </div>
  );
}
