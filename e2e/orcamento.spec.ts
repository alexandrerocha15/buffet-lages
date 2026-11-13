import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function waitForQuoteReady(page: import('@playwright/test').Page): Promise<void> {
  const tabs = page.getByRole('tab');
  await expect(tabs.first()).toBeVisible();
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.first().click();
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
}

test('a11y: rota de orçamento sem violações críticas ou sérias', async ({ page }) => {
  await page.goto('/orcamento');
  await expect(page.getByRole('heading', { name: 'Escolha um ponto de partida' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
});

test('entrada por cardápio: mostra somente a origem com todos os itens selecionados e abas de categoria', async ({ page }) => {
  await page.goto('/cardapios/italiano');
  const ctaSection = page.locator('.quote-entry');
  await expect(ctaSection.getByRole('button', { name: 'Solicitar orçamento deste cardápio' })).toBeVisible();
  await expect(ctaSection.getByRole('button', { name: 'Montar meu próprio cardápio' })).toBeVisible();
  await ctaSection.getByRole('button', { name: 'Solicitar orçamento deste cardápio' }).click();
  await expect(page).toHaveURL(/\/orcamento$/);
  await expect(page.getByText('Cardápio de origem: Cardápio Italiano. Todos os itens começaram selecionados.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cardápio Churrasco' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Cardápio Contemporâneo' })).toHaveCount(0);
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await expect(tabs).toHaveText(['Carnes', 'Massas e acompanhamentos', 'Saladas']);
  await expect(page.getByRole('checkbox', { name: 'Galeto na brasa' })).toBeChecked();
  let originDishCount = 0;
  for (let index = 0; index < await tabs.count(); index += 1) {
    await tabs.nth(index).click();
    await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').getByRole('heading')).toHaveText(await tabs.nth(index).innerText());
    const choices = page.locator('.category-panel input[type="checkbox"]');
    originDishCount += await choices.count();
    for (let choice = 0; choice < await choices.count(); choice += 1) await expect(choices.nth(choice)).toBeChecked();
  }
  expect(originDishCount).toBe(10);
  await tabs.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('checkbox', { name: 'Maionese' })).toBeChecked();
});

test('montagem própria começa com catálogo completo por categoria sem seleção inicial', async ({ page }) => {
  await page.goto('/cardapios/italiano');
  await page.locator('.quote-entry').getByRole('button', { name: 'Montar meu próprio cardápio' }).click();
  await expect(page).toHaveURL(/\/montar$/);
  await expect(page.getByText('Catálogo completo — escolha pratos das categorias disponíveis.')).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(4);
  await expect(page.getByRole('checkbox', { name: 'Carne bovina na churrasqueira' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Pratos principais' }).click();
  await expect(page.getByRole('checkbox', { name: 'Peito de frango grelhado ao molho de laranja' })).toBeVisible();
});

test('pedidos especiais são compactos, editáveis inline e removíveis com ação acessível', async ({ page }) => {
  await page.goto('/montar');
  await expect(page.getByRole('tab').first()).toBeVisible();
  await page.getByRole('tab').nth(1).click();
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab').first().click();
  await expect(page.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
  const entry = page.getByLabel('Pedidos especiais');
  await entry.fill('Menu vegano');
  await entry.press('Enter');
  await expect(page.locator('.special-row')).toHaveCount(1);
  await page.getByRole('button', { name: 'Editar pedido especial: Menu vegano' }).click();
  const edit = page.getByRole('textbox', { name: 'Editar pedido especial 1' });
  await expect(edit).toBeFocused();
  await edit.fill('Menu vegetariano');
  await edit.press('Enter');
  await expect(page.getByRole('button', { name: 'Editar pedido especial: Menu vegetariano' })).toBeVisible();
  await page.getByRole('button', { name: 'Remover pedido especial 1: Menu vegetariano' }).click();
  await expect(page.locator('.special-row')).toHaveCount(0);
});

test('date picker mostra calendário em pt-BR, bloqueia datas passadas e permite escolher uma data', async ({ page }) => {
  await page.goto('/montar');
  await waitForQuoteReady(page);
  await page.getByLabel('Pedidos especiais').fill('Menu para evento');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await page.getByRole('radio', { name: 'Data definida' }).check();
  await page.getByRole('button', { name: 'Abrir calendário do evento' }).click();
  const calendar = page.locator('ngb-datepicker');
  await expect(calendar).toBeVisible();
  const datepickerA11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(datepickerA11y.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? '')).map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => ({ target: node.target, html: node.html, summary: node.failureSummary })) }))).toEqual([]);
  await expect(calendar.locator('.ngb-dp-month-name')).toContainText(/Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro/);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayLabel = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(yesterday);
  await expect(calendar.getByRole('gridcell', { name: yesterdayLabel })).toHaveAttribute('aria-disabled', 'true');
  await expect(calendar.getByRole('button', { name: 'Mês anterior' })).toBeVisible();
  await expect(calendar.getByRole('button', { name: 'Próximo mês' })).toBeVisible();
  const todayLabel = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());
  await calendar.getByRole('gridcell', { name: todayLabel }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#event-date')).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
});

test('prévia e revisão mostram seções editoriais ordenadas, evento separado e movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cardapios/italiano');
  await page.locator('.quote-entry').getByRole('button', { name: 'Solicitar orçamento deste cardápio' }).click();
  await expect(page.getByRole('tab').first()).toBeVisible();
  await page.getByLabel('Pedidos especiais').fill('Opção sem lactose');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  const preview = page.locator('.preview-panel');
  await expect(preview.locator('.editorial-category')).toHaveCount(4);
  await expect(preview.locator('.editorial-category h3')).toHaveText(['Carnes', 'Massas e acompanhamentos', 'Saladas', 'Pedidos especiais']);
  await expect(preview.locator('.editorial-category').nth(0).locator('li')).toHaveText(['Galeto na brasa', 'Pernil suíno na brasa']);
  await expect(preview).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await page.getByLabel('Seu nome').fill('Marina');
  await page.getByLabel('Quantidade aproximada de convidados').fill('40');
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('heading', { name: 'Dados do evento' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mensagem preparada para WhatsApp' })).toHaveCount(0);
  await expect(page.locator('.message-preview, pre[aria-label*="WhatsApp"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Cardápio selecionado' })).toBeVisible();
  await expect(page.locator('.review-menu .editorial-category h4')).toHaveText(['Carnes', 'Massas e acompanhamentos', 'Saladas', 'Pedidos especiais']);
  await expect(page.getByRole('button', { name: 'Editar dados do evento' })).toBeVisible();
});

test('abas e ação principal mantêm contraste em repouso, hover, focus e active', async ({ page }) => {
  await page.goto('/montar');
  const tabs = page.getByRole('tab');
  const activeTab = tabs.first();
  const inactiveTab = tabs.nth(1);
  const activeDefault = await activeTab.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor, bottom: style.borderBottomColor, width: style.borderBottomWidth };
  });
  expect(activeDefault).toEqual({ color: 'rgb(86, 50, 61)', background: 'rgba(0, 0, 0, 0)', bottom: 'rgb(86, 50, 61)', width: '2px' });
  await inactiveTab.hover();
  const inactiveHover = await inactiveTab.evaluate((element) => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
  expect(inactiveHover).toEqual({ color: 'rgb(41, 42, 42)', background: 'rgba(0, 0, 0, 0)' });
  await activeTab.focus();
  const focusedOutline = await activeTab.evaluate((element) => getComputedStyle(element).outlineColor);
  expect(focusedOutline).toBe('rgb(86, 50, 61)');
  await activeTab.hover();
  await page.mouse.down();
  const activePress = await activeTab.evaluate((element) => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
  expect(activePress).toEqual({ color: 'rgb(86, 50, 61)', background: 'rgba(0, 0, 0, 0)' });
  await page.mouse.up();

  const preview = page.getByRole('button', { name: 'Pré-visualizar cardápio' });
  const primaryColor = await preview.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
  expect(primaryColor).toEqual({ background: 'rgb(86, 50, 61)', color: 'rgb(255, 255, 255)' });
  await preview.hover();
  const previewHover = await preview.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
  expect(previewHover.color).toBe('rgb(255, 255, 255)');
  expect(previewHover.background).not.toBe(primaryColor.background);
});

test('a11y: etapas de prévia, dados com erro e revisão continuam acessíveis', async ({ page }) => {
  await page.goto('/montar');
  await waitForQuoteReady(page);
  await page.getByLabel('Pedidos especiais').fill('Prato personalizado');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  await expect(page.getByRole('heading', { name: 'Prévia do cardápio' })).toBeFocused();
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await expect(page.getByRole('heading', { name: 'Dados do evento' })).toBeFocused();
  await expect(page.locator('#event-date, #event-month, #event-year')).toHaveCount(0);
  await page.getByRole('radio', { name: 'Data definida' }).check();
  await expect(page.locator('#event-date')).toBeVisible();
  await page.getByRole('radio', { name: 'Mês aproximado' }).check();
  await expect(page.locator('#event-date')).toHaveCount(0);
  await expect(page.locator('#event-month, #event-year')).toHaveCount(2);
  await page.getByRole('radio', { name: 'Ainda não sei' }).first().check();
  await page.getByRole('radio', { name: 'Local definido' }).check();
  await expect(page.locator('#event-city')).toBeVisible();
  await expect(page.locator('#event-venue, #event-address')).toHaveCount(2);
  await page.getByRole('radio', { name: 'Ainda não sei' }).nth(1).check();
  await expect(page.locator('#event-city, #event-venue, #event-address')).toHaveCount(0);
  let results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('alert')).toContainText('Informe seu nome.');
  await expect(page.locator('#guest-name')).toBeFocused();
  results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByLabel('Seu nome').fill('Bia');
  await page.getByLabel('Quantidade aproximada de convidados').fill('18');
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('heading', { name: 'Revise sua solicitação' })).toBeFocused();
  await page.waitForTimeout(300);
  results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
});

test('jornada: pedido especial válido avança; dados inválidos preservam o valor e revisão expõe URL segura', async ({ page }) => {
  const appRequests: string[] = [];
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4200')) appRequests.push(request.url()); });
  await page.goto('/montar');
  await waitForQuoteReady(page);
  await expect(page.getByRole('tab').first()).toBeVisible();
  const special = page.getByLabel('Pedidos especiais');
  await special.fill('  Menu vegano  '); await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  await expect(page.getByText('Menu vegano')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('alert')).toContainText('Informe seu nome.');
  await page.getByLabel('Seu nome').fill('Ana');
  await page.getByLabel('Quantidade aproximada de convidados').fill('25');
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('heading', { name: 'Revise sua solicitação' })).toBeVisible();
  await expect(page.getByText(/wa\.me/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Enviar solicitação pelo WhatsApp' })).toBeDisabled();
  expect(appRequests).toEqual([]);
});

test('confirmação abre o número oficial com a mensagem completa sem exibi-la na revisão', async ({ page }) => {
  await page.goto('/montar');
  await waitForQuoteReady(page);
  await page.getByRole('checkbox', { name: 'Carne bovina na churrasqueira' }).check();
  await page.getByLabel('Pedidos especiais').fill('Opção sem lactose');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await page.getByLabel('Seu nome').fill('Paula');
  await page.getByLabel('Quantidade aproximada de convidados').fill('35');
  await page.getByLabel('Observações gerais (opcional)').fill('Alergia a amendoim');
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  await expect(page.getByRole('heading', { name: 'Revise sua solicitação' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dados do evento' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cardápio selecionado' })).toBeVisible();
  await expect(page.locator('.message-preview, pre[aria-label*="WhatsApp"]')).toHaveCount(0);
  const submit = page.getByRole('button', { name: 'Enviar solicitação pelo WhatsApp' });
  await expect(submit).toBeDisabled();
  await page.getByRole('checkbox', { name: /Confirmo que desejo abrir o WhatsApp/ }).check();
  await expect(submit).toBeEnabled();
  await page.evaluate(() => {
    (window as typeof window & { __opened?: string }).__opened = '';
    window.open = ((url?: string | URL) => { (window as typeof window & { __opened?: string }).__opened = String(url); return null; }) as typeof window.open;
  });
  await submit.click();
  const opened = await page.evaluate(() => (window as typeof window & { __opened: string }).__opened);
  expect(opened).toMatch(/^https:\/\/wa\.me\/5549991014293\?text=/);
  const message = decodeURIComponent(opened.split('?text=')[1] ?? '');
  expect(message).toContain('Nome: Paula');
  expect(message).toContain('Carnes\n- Carne bovina na churrasqueira');
  expect(message).toContain('Pedidos especiais:\n- Opção sem lactose');
  expect(message).toContain('Observações: Alergia a amendoim');
});

test('a jornada é operável por teclado e não causa rolagem horizontal em viewport móvel', async ({ page, isMobile }) => {
  await page.goto('/montar');
  await expect(page.getByRole('tab').first()).toBeVisible();
  await page.getByRole('tab').nth(1).click();
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab').first().click();
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab').nth(1)).toBeFocused();
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  if (isMobile) await expect(page.getByRole('button', { name: 'Pré-visualizar cardápio' })).toBeVisible();
});

test('privacidade: nenhuma API de armazenamento e nenhuma chamada fora do próprio site durante a jornada', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4200') external.push(request.url()); });
  await page.addInitScript(() => {
    (window as typeof window & { __storageReads?: string[] }).__storageReads = [];
    for (const key of ['localStorage', 'sessionStorage'] as const) {
      Object.defineProperty(window, key, { configurable: false, get: () => { (window as typeof window & { __storageReads: string[] }).__storageReads.push(key); throw new Error(`${key} acessado`); } });
    }
  });
  await page.goto('/orcamento');
  await page.getByRole('button', { name: 'Montar meu próprio cardápio' }).click();
  await page.getByLabel('Pedidos especiais').fill('Pedido sem persistência');
  expect(external).toEqual([]);
  const forbidden = await page.evaluate(() => ({
    storageReads: (window as typeof window & { __storageReads: string[] }).__storageReads,
    quoteCookies: document.cookie,
  }));
  expect(forbidden.storageReads).toEqual([]);
  expect(forbidden.quoteCookies).toBe('');
});

test('fallback de mensagem longa oferece cópia e abertura vazia apenas após confirmação', async ({ page }) => {
  await page.goto('/montar');
  await waitForQuoteReady(page);
  await page.getByLabel('Pedidos especiais').fill(`Pedido longo ${'detalhe '.repeat(280)}`);
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await page.getByRole('button', { name: 'Pré-visualizar cardápio' }).click();
  await page.getByRole('button', { name: 'Confirmar cardápio' }).click();
  await page.getByLabel('Seu nome').fill('Carla');
  await page.getByLabel('Quantidade aproximada de convidados').fill('30');
  await page.getByRole('button', { name: 'Continuar para revisão' }).click();
  const open = page.getByRole('button', { name: 'Enviar solicitação pelo WhatsApp' });
  await expect(open).toBeVisible();
  await expect(page.locator('.message-preview, pre[aria-label*="WhatsApp"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copiar resumo' })).toBeVisible();
  await expect(open).toBeDisabled();
  await page.getByRole('checkbox', { name: /Confirmo que desejo abrir o WhatsApp/ }).check();
  await expect(open).toBeEnabled();
  let opened = '';
  await page.evaluate(() => {
    (window as typeof window & { __opened?: string }).__opened = '';
    window.open = ((url?: string | URL) => { (window as typeof window & { __opened?: string }).__opened = String(url); return null; }) as typeof window.open;
  });
  await open.click();
  opened = await page.evaluate(() => (window as typeof window & { __opened: string }).__opened);
  expect(opened).toBe('https://wa.me/5549991014293?text=');
});
