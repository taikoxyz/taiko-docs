import { expect, type Page, test } from '@playwright/test'
import { siteUrl } from '../playwright.constants'

// Two pages in the same sidebar section, so one is always linked from the
// other and moving between them is a single click.
const overview = '/protocol/overview'
const basedRollups = '/protocol/based-rollups'

test('prerendered HTML carries exactly one canonical URL, matching its own route', async ({
  request,
}) => {
  for (const path of ['/', overview, basedRollups]) {
    const html = await (await request.get(path)).text()
    const expected = `${siteUrl}${path}`

    expect(tags(html, 'link'), `canonical on ${path}`).toEqual([
      expect.stringContaining(`href="${expected}"`),
    ])
    expect(tags(html, 'meta'), `og:url on ${path}`).toEqual([
      expect.stringContaining(`content="${expected}"`),
    ])
  }
})

test('canonical and og:url follow client-side navigation', async ({ page }) => {
  await page.goto(overview)
  await expectRouteMetadata(page, overview)

  await softNavigate(page, basedRollups)
  await expectRouteMetadata(page, basedRollups)

  // Navigating back must not leave a stale tag behind either.
  await softNavigate(page, overview)
  await expectRouteMetadata(page, overview)
})

/** Click through to `path` and assert the router handled it without a page load. */
async function softNavigate(page: Page, path: string) {
  await page.evaluate(() => {
    ;(window as Window & { didNotReload?: boolean }).didNotReload = true
  })

  await page.locator(`a[href="${path}"]:visible`).first().click()
  await expect(page).toHaveURL(path)

  expect(
    await page.evaluate(() => (window as Window & { didNotReload?: boolean }).didNotReload),
    'expected a soft navigation, but the document reloaded',
  ).toBe(true)
}

async function expectRouteMetadata(page: Page, path: string) {
  const expected = `${siteUrl}${path}`
  const canonical = page.locator('link[rel="canonical"]')
  const ogUrl = page.locator('meta[property="og:url"]')

  await expect(canonical).toHaveCount(1)
  await expect(canonical).toHaveAttribute('href', expected)
  await expect(ogUrl).toHaveCount(1)
  await expect(ogUrl).toHaveAttribute('content', expected)
}

/** Every canonical `<link>` / og:url `<meta>` in a raw HTML document. */
function tags(html: string, name: 'link' | 'meta') {
  const attribute = name === 'link' ? 'rel="canonical"' : 'property="og:url"'
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*${attribute}[^>]*>`, 'g'))].map(([tag]) => tag)
}
