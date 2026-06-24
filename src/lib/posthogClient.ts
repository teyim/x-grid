import type posthog from 'posthog-js';

type PostHogClient = typeof posthog;

let clientPromise: Promise<PostHogClient | null> | null = null;

export async function getPostHogClient() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;

  clientPromise ??= import('posthog-js').then((module) => {
    const client = module.default;

    if (!client.__loaded) {
      client.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        defaults: '2025-05-24',
      });
    }

    return client;
  });

  return clientPromise;
}

export async function capturePostHog(event: string, properties?: Record<string, unknown>) {
  const client = await getPostHogClient();
  client?.capture(event, properties);
}

export async function getPostHogDistinctId() {
  const client = await getPostHogClient();
  return client?.get_distinct_id?.() ?? null;
}
