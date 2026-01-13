import { test, expect } from '@playwright/test';

test('la page d\'accueil affiche le titre', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText(/connexion/i);
});
