/* eslint-disable no-await-in-loop */
import {
  expect, test, type Locator, type Page,
} from '@playwright/test';
import {
  nextClick,
  openStudyFromLanding,
  resetClientStudyState,
  waitForStudyEndMessage,
} from './utils';

async function answerTaskA(page: Page) {
  await page.getByRole('radio', { name: 'Yes, it applies' }).click();
  await page.locator('#confidence .mantine-Slider-track').click();
  await page.getByRole('checkbox', { name: 'Technique title' }).click();
}

async function answerTaskB(page: Page) {
  await page.getByRole('radio', { name: 'Technique 1' }).click();
  await page.getByRole('radio', { name: '5' }).click();
  await page.getByRole('checkbox', { name: 'Scenario description' }).click();
  await page.getByRole('checkbox', { name: 'Technique title' }).click();
}

async function dragWithMouse(page: Page, source: Locator, target: Locator) {
  await expect(source).toBeVisible();
  await expect(target).toBeVisible();

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  expect(sourceBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  const sourceX = (sourceBox as { x: number; width: number }).x + ((sourceBox as { width: number }).width / 2);
  const sourceY = (sourceBox as { y: number; height: number }).y + ((sourceBox as { height: number }).height / 2);
  const targetX = (targetBox as { x: number; width: number }).x + ((targetBox as { width: number }).width / 2);
  const targetHeight = (targetBox as { height: number }).height;
  const targetY = (targetBox as { y: number }).y + Math.max(32, Math.min(targetHeight - 8, targetHeight * 0.65));

  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.mouse.move(sourceX + 8, sourceY + 8);
  await page.mouse.move(targetX, targetY, { steps: 12 });
  await page.mouse.up();
}

async function answerPartC(page: Page) {
  await page.getByRole('radio', { name: 'Yes', exact: true }).click();

  const availableZone = page.locator('div.mantine-Paper-root[data-with-border="true"]').filter({
    has: page.getByText('Available Items', { exact: true }),
  }).first();
  const selectedZone = page.locator('div.mantine-Paper-root[data-with-border="true"]').filter({
    has: page.getByText('HIGH', { exact: true }),
  }).filter({
    has: page.getByText('LOW', { exact: true }),
  }).first();

  await dragWithMouse(
    page,
    availableZone.getByText('Modality', { exact: true }).first()
      .locator('xpath=ancestor::div[contains(@class,"mantine-Paper-root")][1]'),
    selectedZone,
  );
  await page.waitForTimeout(250);

  await page.getByPlaceholder('If nothing was missing, write none.').fill('none');
  await page.getByRole('radio', { name: /Somewhat prefer the ontology tags/ }).click();
  await page.getByPlaceholder('A sentence or two is enough.').fill('The tags made the technique easier to scan.');

  for (let row = 0; row < 5; row += 1) {
    const rowRadios = page.locator(`input[type="radio"][name="radioInputontologyApplications-${row}"]`);
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
      await expect(page.getByText('You do not need to open every section')).toBeVisible();
      await expect(page.getByText('1 = Not at all confident. 5 = Completely confident.')).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Scenario description' })).toHaveCount(0);
      await expect(page.getByRole('checkbox', { name: /Nothing beyond what was visible/ })).toHaveCount(0);
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

  await expect(page.getByText('Did you notice a difference')).toBeVisible();
  await answerPartC(page);
  await nextClick(page);

  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
  await nextClick(page);
  await waitForStudyEndMessage(page);
});
