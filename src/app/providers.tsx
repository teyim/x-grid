// app/providers.tsx
'use client'


import { useEffect } from "react"


import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { I18nProvider } from '@/lib/i18n'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      defaults: '2025-05-24'
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <I18nProvider>{children}</I18nProvider>
    </PHProvider>
  )
}
