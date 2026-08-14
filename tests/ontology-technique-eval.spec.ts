import { expect, test, type Page } from '@playwright/test';
import {
  nextClick,
  openStudyFromLanding,
  resetClientStudyState,
} from './utils';

async function answerFirstTaskA(page: Page) {
  const applies = page.getByRole('radio', { name: 'Yes, it applies' });
  await expect(applies).toBeVisible({ timeout: 20000 });
  await applies.click({ force: true });
  await page.locator('#confidence .mantine-Slider-track').click();
  await page.getByRole('checkbox', { name: 'Technique title' }).click();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled();
}

test('ontology technique evaluation study loads consent, intro, and a Task A trial', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1400, height: 900 });
  await resetClientStudyState(page);
  await openStudyFromLanding(
    page,
    'Your Studies',
    'Ontology-supported descriptions of digital media forensic techniques',
  );

  const consentFrame = page.frameLocator('iframe');
  await expect(consentFrame.getByRole('heading', { name: /Ontology-based Framework/i })).toBeVisible();
  await expect(consentFrame.locator('.glance').getByText('About 45 minutes', { exact: true })).toBeVisible();
  await expect(consentFrame.locator('.people').first().getByText('Saniat J. Sohrawardi', { exact: true })).toBeVisible();
  await expect(consentFrame.getByRole('link', { name: 'john.sohrawardi@rit.edu' }).first()).toBeVisible();

  await page.getByRole('radio', { name: /I agree to participate/i }).click();
  await nextClick(page);

  await expect(page.getByText('Keyword supported')).toBeVisible();
  await expect(page.getByText('Ontology supported')).toBeVisible();
  await nextClick(page);

  await expect(page.getByRole('heading', { name: 'Task A' })).toBeVisible();
  await nextClick(page);

  await expect(page.getByText('You do not need to open every section')).toBeVisible();
  await expect(page.getByText('1 = Not at all confident. 5 = Completely confident.')).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Scenario description' })).toHaveCount(0);
  await answerFirstTaskA(page);
});
