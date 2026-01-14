import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/");

  // Utilisation de user/pass fixes
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "Password123!"); 

  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
}

test.describe("Dashboard", () => {
  test.beforeAll(async ({ request }) => {
    await request
      .post("http://localhost:8080/api/user/register", {
        data: {
          firstName: "Test",
          lastName: "Example",
          email: "test@example.com",
          password: "Password123!",
        },
      })
      .catch(() => {}); 
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.waitForTimeout(1000);
  });

  test("affiche les jauges de santé", async ({ page }) => {
    await expect(page.getByText("Chargement...")).toBeHidden({
      timeout: 15000,
    });

    // Vérifier qu'on est bien sur le dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("nav")).toBeVisible();

    // Vérifier globalement la présence des textes clés
    const body = page.locator("body");
    await expect(body).toContainText("Sucre");
    await expect(body).toContainText("Caféine");
    await expect(body).toContainText("Calories");
    await expect(body).toContainText("Contributions");

    // Vérifier les unités
    await expect(body).toContainText("g");
    await expect(body).toContainText("mg");
  });

  test("affiche la barre de navigation avec le nom de l'utilisateur", async ({
    page,
  }) => {
    await expect(page.getByText("Test Example")).toBeVisible();
    await expect(page.getByText("Déconnexion")).toBeVisible();
  });
});