/* eslint-disable no-await-in-loop */
import { expect, test, type Page } from '@playwright/test';
import {
  nextClick,
  openStudyFromLanding,
  resetClientStudyState,
  waitForStudyEndMessage,
} from './utils';

async function answerTaskA(page: Page) {
  await page.getByRole('radio', { name: 'Yes, it applies' }).click();
  await page.getByRole('radio', { name: '5' }).click();
  await page.getByRole('checkbox', { name: 'Scenario description' }).click();
  await page.getByRole('checkbox', { name: 'Technique title' }).click();
}

async function answerTaskB(page: Page) {
  await page.getByRole('radio', { name: 'Technique 1' }).click();
  await page.getByRole('radio', { name: '5' }).click();
  await page.getByRole('checkbox', { name: 'Scenario description' }).click();
  await page.getByRole('checkbox', { name: 'Technique title' }).click();
}

async function answerPartC(page: Page) {
  const rows = 10;
  for (let row = 0; row < rows; row += 1) {
    const rowRadios = page.locator(`input[type="radio"][name="radioInputformatUsefulness-${row}"]`);
    await expect(rowRadios.first()).toBeVisible();
    await rowRadios.nth(3).click();
  }
}

test('ontology technique evaluation study walks through consent, formats, and tasks', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1400, height: 900 });
  await resetClientStudyState(page);
  await openStudyFromLanding(
    page,
    'Your Studies',
    'Ontology-supported descriptions of digital media forensic techniques',
  );

  const consentFrame = page.frameLocator('iframe');
  await expect(consentFrame.getByRole('heading', { name: /Ontology-based Framework/i })).toBeVisible();
  const glance = consentFrame.locator('.glance');
  await expect(glance.getByText('About 45 minutes', { exact: true })).toBeVisible();
  await expect(glance.getByText('$15 via Prolific', { exact: true })).toBeVisible();
  const researchTeam = consentFrame.locator('.people').first();
  await expect(researchTeam.getByText('Y. Kelly Wu', { exact: true })).toBeVisible();
  await expect(researchTeam.getByText('Saniat J. Sohrawardi', { exact: true })).toBeVisible();

  await page.getByRole('radio', { name: /I agree to participate/i }).click();
  await nextClick(page);

  await expect(page.getByText('Keyword supported')).toBeVisible();
  await expect(page.getByText('Ontology supported')).toBeVisible();
  await page.getByRole('button', { name: 'Abstract' }).first().click();
  await expect(page.getByText(/PLACEHOLDER ABSTRACT/i).first()).toBeVisible();
  await nextClick(page);

  await expect(page.getByRole('heading', { name: 'Task A' })).toBeVisible();
  await nextClick(page);

  for (let i = 0; i < 9; i += 1) {
    const isAttention = await page.getByText('Attention check: please select').isVisible().catch(() => false);
    if (isAttention) {
      await page.getByRole('radio', { name: 'Somewhat agree' }).click();
    } else {
      await expect(page.getByText('Could this technique be applied')).toBeVisible();
      await page.getByRole('button', { name: 'Abstract' }).first().click();
      await answerTaskA(page);
    }
    await nextClick(page);
  }

  await expect(page.getByRole('heading', { name: 'Task B' })).toBeVisible();
  await nextClick(page);

  for (let i = 0; i < 5; i += 1) {
    const isAttention = await page.getByText('Attention check: what is 8 + 3?').isVisible().catch(() => false);
    if (isAttention) {
      await page.getByRole('radio', { name: '11' }).click();
    } else {
      await expect(page.getByText('Which technique is the appropriate fit')).toBeVisible();
      await expect(page.getByText('Technique 1', { exact: false }).first()).toBeVisible();
      await answerTaskB(page);
    }
    await nextClick(page);
  }

  await expect(page.getByRole('heading', { name: 'Reflection and feedback' })).toBeVisible();
  await nextClick(page);

  await answerPartC(page);
  await nextClick(page);

  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
  await nextClick(page);
  await waitForStudyEndMessage(page);
});
