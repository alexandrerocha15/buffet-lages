import { expect, test } from '@playwright/test';

test('marca oficial aparece sem corte na navegação e no rodapé em desktop e mobile', async ({
  page,
}) => {
  await page.goto('/');

  const brand = page.locator('.brand');
  const brandImage = brand.locator('.brand-logo');
  const brandHatLink = brand.getByRole('link', { name: 'Ir para a página inicial' });
  const brandHat = brandHatLink.locator('.brand-hat');
  await expect(brandHatLink).toHaveAttribute('href', '/');
  await expect(brand.locator('a .brand-logo')).toHaveCount(0);
  await expect(brandImage).toHaveAttribute('src', 'brand/logo-nav.png');
  await expect(brandHat).toHaveAttribute('src', 'brand/logo-chapel.png');
  await expect(brandImage).toBeVisible();
  await expect(brandHat).toBeVisible();
  await expect
    .poll(() => brandImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect
    .poll(() =>
      brandImage.evaluate((image: HTMLImageElement) =>
        Math.abs(image.clientWidth / image.clientHeight - image.naturalWidth / image.naturalHeight),
      ),
    )
    .toBeLessThan(0.06);
  await expect
    .poll(() =>
      brandImage.evaluate((image: HTMLImageElement) => image.naturalWidth / image.naturalHeight),
    )
    .toBeCloseTo(2, 1);
  await expect(brand).toHaveCSS('gap', '8px');
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(86, 50, 61)');

  const brandStyle = await brandImage.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      cursor: style.cursor,
      transition: style.transitionDuration,
      transform: style.transform,
    };
  });
  await brandImage.hover();
  await expect
    .poll(() =>
      brandImage.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          cursor: style.cursor,
          transition: style.transitionDuration,
          transform: style.transform,
        };
      }),
    )
    .toEqual(brandStyle);
  expect(brandStyle.cursor).not.toBe('pointer');
  expect(brandStyle.transition).toBe('0s');
  expect(brandStyle.transform).toBe('none');

  const isMobile = page.viewportSize()!.width < 928;
  await expect
    .poll(() => brandImage.evaluate((image: HTMLImageElement) => image.clientHeight))
    .toBeGreaterThan(isMobile ? 32 : 36);
  await expect
    .poll(() => brandHat.evaluate((image: HTMLImageElement) => image.clientHeight))
    .toBeGreaterThan(isMobile ? 24 : 28);
  await expect(page.locator('.site-header')).toHaveCSS('height', isMobile ? '60px' : '72px');

  const footerMark = page.locator('.footer-name img');
  await expect(footerMark).toHaveAttribute('src', 'brand/logo-chapel.png');
  await expect(footerMark).toBeVisible();
  await expect
    .poll(() => footerMark.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.locator('.footer-name')).toHaveCSS('align-items', 'center');
  await expect(footerMark).toHaveCSS('height', '32px');
  await expect(page.locator('.site-footer')).toHaveCSS('background-color', 'rgb(41, 42, 42)');
  await expect(page.locator('.footer-name')).toContainText('Buffet Lages');

  const brandBounds = await brand.boundingBox();
  expect(brandBounds).not.toBeNull();
  expect(brandBounds!.x).toBeGreaterThanOrEqual(0);
  expect(brandBounds!.x + brandBounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  const photoShadow = await page.locator('.hero-carousel').evaluate((carousel) => {
    const style = getComputedStyle(carousel, '::after');
    return { background: style.backgroundImage, height: Number.parseFloat(style.height) };
  });
  expect(photoShadow.background).toMatch(/linear-gradient\(to top/i);
  expect(photoShadow.background).toContain('rgba(41, 42, 42, 0.22)');
  expect(photoShadow.height).toBeGreaterThanOrEqual(32);

  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
});
