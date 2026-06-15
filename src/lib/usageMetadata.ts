import { NextRequest } from 'next/server';

export type UsageEventType = 'tool_started' | 'grid_created' | 'download_started';
export type UsagePlatform = 'x' | 'instagram';
export type UsageFitMode = 'cover' | 'contain';

export type UsageEventPayload = {
  eventType?: string;
  platform?: string;
  modeId?: string;
  modeLabel?: string;
  tileCount?: number;
  inputImageCount?: number;
  fitMode?: string | null;
  route?: string;
  locale?: string;
};

export type UsageEventRow = {
  event_type: UsageEventType;
  platform: UsagePlatform | null;
  mode_id: string | null;
  mode_label: string | null;
  tile_count: number | null;
  input_image_count: number | null;
  fit_mode: UsageFitMode | null;
  route: string | null;
  locale: string | null;
  country_code: string | null;
  country_name: string | null;
};

export function buildUsageEventRow(
  request: NextRequest,
  payload: UsageEventPayload,
  eventType: UsageEventType
): UsageEventRow {
  const country = getRequestCountry(request);

  return {
    event_type: eventType,
    platform: normalizePlatform(payload.platform),
    mode_id: truncate(cleanString(payload.modeId), 64),
    mode_label: truncate(cleanString(payload.modeLabel), 120),
    tile_count: normalizeCount(payload.tileCount),
    input_image_count: normalizeCount(payload.inputImageCount),
    fit_mode: normalizeFitMode(payload.fitMode),
    route: truncate(cleanString(payload.route), 500),
    locale: truncate(cleanString(payload.locale), 32),
    country_code: country.code,
    country_name: country.name,
  };
}

export function validateUsagePayload(payload: UsageEventPayload):
  | { ok: true; eventType: UsageEventType }
  | { ok: false; error: string } {
  if (
    payload.eventType !== 'tool_started' &&
    payload.eventType !== 'grid_created' &&
    payload.eventType !== 'download_started'
  ) {
    return { ok: false, error: 'Invalid event type.' };
  }

  if (payload.platform !== undefined && normalizePlatform(payload.platform) === null) {
    return { ok: false, error: 'Invalid platform.' };
  }

  if (payload.tileCount !== undefined && normalizeCount(payload.tileCount) === null) {
    return { ok: false, error: 'Invalid tile count.' };
  }

  if (payload.inputImageCount !== undefined && normalizeCount(payload.inputImageCount) === null) {
    return { ok: false, error: 'Invalid image count.' };
  }

  if (payload.fitMode !== undefined && payload.fitMode !== null && normalizeFitMode(payload.fitMode) === null) {
    return { ok: false, error: 'Invalid fit mode.' };
  }

  return { ok: true, eventType: payload.eventType };
}

export function cleanString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function truncate(value: string | null, length: number) {
  if (!value) return null;
  return value.slice(0, length);
}

function normalizePlatform(value: unknown): UsagePlatform | null {
  return value === 'x' || value === 'instagram' ? value : null;
}

function normalizeFitMode(value: unknown): UsageFitMode | null {
  return value === 'cover' || value === 'contain' ? value : null;
}

function normalizeCount(value: unknown) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 100) return null;
  return value;
}

function getRequestCountry(request: NextRequest) {
  const headerValue =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');

  if (!headerValue || headerValue.toUpperCase() === 'XX') {
    return { code: null, name: null };
  }

  const code = headerValue.toUpperCase().slice(0, 8);

  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return { code, name: displayNames.of(code) || code };
  } catch {
    return { code, name: code };
  }
}
