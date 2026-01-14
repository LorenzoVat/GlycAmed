import { test, expect } from "@playwright/test";

test.describe("Authentification", () => {
  test.describe.configure({ mode: "serial" });

  const email = `test-${Date.now()}@example.com`;
  const password = "Password123!";

  // Ajouter un délai entre chaque test pour éviter les conflits
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
  });

  // Créer un compte avant de tester le login
  test("Inscription d'un nouvel utilisateur", async ({ page }) => {
    await page.goto("/"); // Le login est sur /

    // Basculer vers le mode inscription
    // Note: Le texte du toggle est "Créer un compte maintenant" initialement
    await page.click("text=Créer un compte maintenant");

    await page.fill('input[name="firstName"]', "Jean");
    await page.fill('input[name="lastName"]', "Testeur");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    await page.click('button[type="submit"]'); // Bouton "S'inscrire"

    // Vérifier la redirection
    await expect(page).toHaveURL(/dashboard/);

    // Déconnexion pour le test suivant
    await page.click('button:has-text("Déconnexion")');
    await expect(page).toHaveURL("/");
    // Attendre un peu pour être sûr que le cookie est nettoyé côté client/serveur
    await page.waitForTimeout(500);
  });

  test("Connexion avec identifiants valides", async ({ page }) => {
    await page.goto("/");

    // S'assurer qu'on est sur le login (par défaut)

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    await page.click('button[type="submit"]'); // Bouton "Se connecter"

    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Affiche une erreur avec mot de passe invalide", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "WrongPassword123");

    await page.click('button[type="submit"]');

    // Attendre que la requête se termine (optionnel mais plus sûr)
    // Ou juste attendre que le message apparaisse
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 10000 });
  });
});
