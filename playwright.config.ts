import { defineConfig, devices } from '@playwright/test'
import { previewUrl, siteUrl } from './playwright.constants'

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: previewUrl,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Always rebuild rather than reusing a running server: the specs assert on
  // absolute URLs baked in at build time, so they are only meaningful against
  // a build made with this SITE_URL.
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    url: previewUrl,
    env: { SITE_URL: siteUrl },
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 5 * 60 * 1000,
  },
})
