import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'

import '@catppuccin/vitepress/theme/mocha/mauve.css'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import BoardGameShelf from './components/BoardGameShelf.vue'

// PostHog
import posthog from 'posthog-js'

export default {
  ...DefaultTheme,
  Layout,

  enhanceApp({ app, router }) {
    // Register your component
    app.component('BoardGameShelf', BoardGameShelf)

    // Only run in browser
    if (typeof window !== 'undefined') {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false, // IMPORTANT: we handle this manually
      })

      // Track SPA navigation properly
      router.onAfterRouteChanged = (to) => {
        posthog.capture('$pageview', {
          path: to,
        })
      }
    }
  }
} satisfies Theme
