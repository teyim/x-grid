import { Resend } from 'resend';
import type { UsageEventRow } from '@/lib/usageMetadata';

const eventLabels: Record<UsageEventRow['event_type'], string> = {
  tool_started: 'Tool started',
  grid_created: 'Grid created',
  download_started: 'Image download',
};

export async function sendUsageAlertEmail(row: UsageEventRow) {
  if (row.event_type !== 'grid_created' && row.event_type !== 'download_started') return;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.USAGE_ALERT_TO || process.env.FEEDBACK_ALERT_TO;
  const from = process.env.USAGE_ALERT_FROM || process.env.FEEDBACK_ALERT_FROM;

  if (!apiKey || !to || !from) return;

  try {
    const resend = new Resend(apiKey);
    const label = eventLabels[row.event_type];

    await resend.emails.send({
      from,
      to,
      subject: `[socialgridtool] ${label}: ${row.mode_label ?? row.mode_id ?? 'Unknown mode'}`,
      text: [
        `Event: ${label}`,
        `Platform: ${row.platform ?? 'Not provided'}`,
        `Mode: ${row.mode_label ?? row.mode_id ?? 'Not provided'}`,
        `Tiles: ${row.tile_count ?? 'Not provided'}`,
        `Input images: ${row.input_image_count ?? 'Not provided'}`,
        `Fit mode: ${row.fit_mode ?? 'Not provided'}`,
        `Route: ${row.route ?? 'Not provided'}`,
        `Locale: ${row.locale ?? 'Not provided'}`,
        `Country: ${row.country_name ?? row.country_code ?? 'Not provided'}`,
      ].join('\n'),
    });
  } catch (error) {
    console.error('Usage email alert failed:', error);
  }
}
