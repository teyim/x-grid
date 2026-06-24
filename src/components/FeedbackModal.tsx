'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bug, Lightbulb, MessageSquare, Send, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  feedbackOptions,
  feedbackTypes,
  type FeedbackPayload,
  type FeedbackType,
} from '@/lib/feedback';
import { CONTACT_EMAIL } from '@/lib/contact';
import { useI18n } from '@/lib/i18n';
import { capturePostHog, getPostHogDistinctId } from '@/lib/posthogClient';
import { cn } from '@/lib/utils';

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [type, setType] = useState<FeedbackType>('feedback');
  const [option, setOption] = useState(feedbackOptions.feedback[0]);
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [error, setError] = useState('');
  const fallbackEmail = CONTACT_EMAIL;

  const mailtoHref = useMemo(() => {
    if (!fallbackEmail) return null;

    const subject = `[socialgridtool] ${getTypeLabel(type, t)}`;
    const body = [
      `${t('feedback.type')}: ${getTypeLabel(type, t)}`,
      `${t('feedback.option')}: ${getOptionLabel(option, t)}`,
      `${t('feedback.rating')}: ${rating ?? '-'}`,
      `Route: ${pathname}`,
      `Locale: ${locale}`,
      '',
      message,
    ].join('\n');

    return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [fallbackEmail, locale, message, option, pathname, rating, t, type]);

  if (!open) return null;

  const selectType = (nextType: FeedbackType) => {
    setType(nextType);
    setOption(feedbackOptions[nextType][0]);
    setState('idle');
    setError('');
  };

  const close = () => {
    setState('idle');
    setError('');
    onClose();
  };

  const submitFeedback = async () => {
    setState('submitting');
    setError('');

    const payload: FeedbackPayload = {
      type,
      option,
      rating,
      message,
      email,
      route: pathname,
      locale,
      posthogDistinctId: (await getPostHogDistinctId()) ?? undefined,
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok: boolean; id?: string; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || t('feedback.error'));
      }

      void capturePostHog('feedback_submitted', {
        type,
        option,
        rating,
        route: pathname,
        locale,
      });
      setState('success');
      setMessage('');
      setEmail('');
      setRating(null);
    } catch (caughtError) {
      setState('error');
      setError(caughtError instanceof Error ? caughtError.message : t('feedback.error'));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-3 py-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-zinc-950">{t('feedback.title')}</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{t('feedback.description')}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            aria-label={t('feedback.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 space-y-4 overflow-auto p-4">
          {state === 'success' ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-900">{t('feedback.successTitle')}</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">{t('feedback.successBody')}</p>
              {mailtoHref && (
                <a
                  href={mailtoHref}
                  className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4"
                >
                  {t('feedback.emailInstead')}
                </a>
              )}
            </div>
          ) : (
            <>
              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-950">{t('feedback.type')}</p>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
                  {feedbackTypes.map((item) => {
                    const Icon = item === 'bug' ? Bug : item === 'suggestion' ? Lightbulb : MessageSquare;
                    const active = item === type;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => selectType(item)}
                        className={cn(
                          'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm font-semibold transition',
                          active
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white'
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {getTypeLabel(item, t)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-950">{t('feedback.option')}</p>
                <div className="flex flex-wrap gap-2">
                  {feedbackOptions[type].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setOption(item)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                        option === item
                          ? 'border-orange-500 bg-orange-50 text-orange-800'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                      )}
                    >
                      {getOptionLabel(item, t)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-950">{t('feedback.rating')}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRating(rating === item ? null : item)}
                      className={cn(
                        'inline-flex size-9 items-center justify-center rounded-md border transition',
                        rating && item <= rating
                          ? 'border-orange-400 bg-orange-50 text-orange-600'
                          : 'border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700'
                      )}
                      aria-label={`${t('feedback.rating')} ${item}`}
                    >
                      <Star className="size-4" fill={rating && item <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-950">{t('feedback.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value.slice(0, 254))}
                  placeholder={t('feedback.emailPlaceholder')}
                  className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-950">{t('feedback.message')}</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 2000))}
                  rows={4}
                  maxLength={2000}
                  placeholder={t('feedback.messagePlaceholder')}
                  className="mt-2 w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                />
                <span className="mt-1 block text-right text-xs text-zinc-400">{message.length}/2000</span>
              </label>

              {state === 'error' && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          {mailtoHref ? (
            <a
              href={mailtoHref}
              className="text-sm font-semibold text-zinc-600 underline underline-offset-4 hover:text-zinc-950"
            >
              {t('feedback.emailInstead')}
            </a>
          ) : (
            <span className="text-xs text-zinc-500">{t('feedback.privateNote')}</span>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <Button type="button" variant="secondary" onClick={close}>
              {t('feedback.close')}
            </Button>
            {state !== 'success' && (
              <Button type="button" onClick={submitFeedback} disabled={state === 'submitting'}>
                <Send className="size-4" />
                {state === 'submitting' ? t('feedback.submitting') : t('feedback.submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeLabel(type: FeedbackType, t: ReturnType<typeof useI18n>['t']) {
  const labels: Record<FeedbackType, string> = {
    feedback: t('feedback.typeFeedback'),
    bug: t('feedback.typeBug'),
    suggestion: t('feedback.typeSuggestion'),
  };

  return labels[type];
}

function getOptionLabel(option: string, t: ReturnType<typeof useI18n>['t']) {
  const labels: Record<string, string> = {
    easy_to_use: t('feedback.optionEasy'),
    confusing: t('feedback.optionConfusing'),
    design_feedback: t('feedback.optionDesign'),
    missing_feature: t('feedback.optionMissing'),
    upload_issue: t('feedback.optionUpload'),
    preview_issue: t('feedback.optionPreview'),
    download_issue: t('feedback.optionDownload'),
    mobile_layout_issue: t('feedback.optionMobile'),
    new_grid_type: t('feedback.optionGridType'),
    better_crop_zoom: t('feedback.optionCropZoom'),
    more_platforms: t('feedback.optionPlatforms'),
    seo_content_idea: t('feedback.optionSeo'),
  };

  return labels[option] || option;
}
