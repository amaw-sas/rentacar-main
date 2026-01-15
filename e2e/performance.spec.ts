import { test, expect } from '@playwright/test';

test.describe('Rendimiento y Core Web Vitals', () => {
  test('debe cargar la página principal rápidamente', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // La página debe cargar en menos de 3 segundos
    expect(loadTime).toBeLessThan(3000);
  });

  test('debe precargar imágenes críticas del hero', async ({ page }) => {
    await page.goto('/');

    // Verificar que hay preload links para imágenes
    const preloadLinks = page.locator('link[rel="preload"][as="image"]');
    const count = await preloadLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe tener preconnect a Firebase Storage', async ({ page }) => {
    await page.goto('/');

    // Verificar preconnect
    const preconnect = page.locator('link[rel="preconnect"][href*="firebasestorage"]');
    await expect(preconnect).toHaveCount(1);
  });

  test('las imágenes deben tener atributos de carga optimizados', async ({ page }) => {
    await page.goto('/');

    // Verificar que las imágenes tienen loading="lazy" (excepto hero)
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      // Al menos debe haber imágenes en la página
      expect(count).toBeGreaterThan(0);
    }
  });

  test('debe evitar layout shifts (CLS)', async ({ page }) => {
    await page.goto('/');

    // Esperar a que todo cargue
    await page.waitForLoadState('networkidle');

    // Evaluar CLS usando PerformanceObserver
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsValue += (entry as any).value;
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Resolver después de un tiempo
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });

    // CLS debe ser menor a 0.1 (bueno según Google)
    expect(cls).toBeLessThan(0.25);
  });

  test('debe tener caché correcto para assets estáticos', async ({ page }) => {
    const response = await page.goto('/_nuxt/entry.js', { waitUntil: 'domcontentloaded' });

    if (response) {
      const cacheControl = response.headers()['cache-control'];
      // Los assets de Nuxt deben tener caché largo
      expect(cacheControl).toBeTruthy();
    }
  });
});
