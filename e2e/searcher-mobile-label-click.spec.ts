import { test, expect } from '@playwright/test';

test.describe('Searcher - Mobile Label Click Bug', () => {
  test('hacer clic en label móvil NO debe activar componente desktop', async ({ page }) => {
    // Configurar viewport móvil (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Ir a página de ciudad con searcher
    await page.goto('/armenia');

    // Esperar que el componente searcher esté visible
    await page.waitForLoadState('networkidle');

    // Verificar que el select nativo móvil está visible
    // Nota: Hay dos Searcher en la página (desktop en hidden lg:flex y mobile en lg:hidden)
    // El segundo (.last()) es el que está visible en móvil
    const mobileSelect = page.locator('select#pickup-location-mobile').last();
    await expect(mobileSelect).toBeVisible();

    // Verificar que el componente desktop está oculto (por CSS)
    // El primero (.first()) es el del contenedor desktop que está hidden en móvil
    const desktopComponent = page.locator('#pickup-location').first();
    await expect(desktopComponent).toBeHidden();

    // Hacer clic en el label "Lugar de recogida" visible
    // Como el label también está duplicado, usar el visible
    const label = page.locator('label:has-text("Lugar de recogida")').last();
    await label.click();

    // VERIFICACIÓN CRÍTICA: El componente desktop NO debe activarse
    // Si el bug existe, el u-select-menu desktop se abrirá (mostrará dropdown)
    // Buscamos el dropdown/popover del u-select-menu
    const desktopDropdown = page.locator('[role="listbox"], [role="menu"]');

    // El dropdown NO debe estar visible en móvil
    // Esperamos que NO haya ningún dropdown visible
    await expect(desktopDropdown).toHaveCount(0);

    // Verificar que el select nativo móvil está enfocado
    const activeElementId = await page.evaluate(() => document.activeElement?.id);
    expect(activeElementId).toBe('pickup-location-mobile');
  });

  test('hacer clic en label móvil debe activar solo el input móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/armenia');
    await page.waitForLoadState('networkidle');

    // Hacer clic en el label de fecha de recogida visible (el segundo, del Searcher móvil)
    const dateLabel = page.locator('label:has-text("Día de recogida")').last();
    await dateLabel.click();

    // Verificar que el input date nativo móvil recibe el foco
    const mobileDateInput = page.locator('input#pickup-date-mobile[type="date"]').last();
    await expect(mobileDateInput).toBeFocused();

    // Verificar que el componente desktop NO está enfocado (el primero, del Searcher desktop)
    const desktopDateInput = page.locator('#pickup-date').first();
    await expect(desktopDateInput).not.toBeFocused();
  });
});
