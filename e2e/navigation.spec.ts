import { test, expect } from '@playwright/test';

test.describe('Navegación del sitio', () => {
  test('debe navegar entre ciudades principales', async ({ page }) => {
    await page.goto('/');

    // Lista de ciudades principales a probar
    const ciudades = ['bogota', 'medellin', 'cali'];

    for (const ciudad of ciudades) {
      await page.goto(`/${ciudad}`);

      // Verificar que la página cargó
      await expect(page).toHaveURL(new RegExp(`/${ciudad}`));

      // Verificar que hay contenido H1
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
    }
  });

  test('debe navegar a la página de blog', async ({ page }) => {
    await page.goto('/blog');

    // Verificar URL
    await expect(page).toHaveURL(/\/blog/);

    // Verificar que hay contenido
    await expect(page.locator('h1')).toBeVisible();
  });

  test('debe navegar a términos y condiciones', async ({ page }) => {
    await page.goto('/terminos-condiciones');

    // Verificar URL
    await expect(page).toHaveURL(/\/terminos-condiciones/);

    // Verificar contenido
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('debe navegar a política de privacidad', async ({ page }) => {
    await page.goto('/politica-privacidad');

    // Verificar URL
    await expect(page).toHaveURL(/\/politica-privacidad/);

    // Verificar contenido
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('debe cargar correctamente la página de gana', async ({ page }) => {
    await page.goto('/gana');

    // Verificar URL
    await expect(page).toHaveURL(/\/gana/);

    // Verificar contenido
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
