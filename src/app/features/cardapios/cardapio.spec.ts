import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MENU_SOURCE } from '../../core/content/menu-source';
import { StaticMenuSource } from '../../core/content/static-menu-source';
import { Cardapio } from './cardapio';

describe('Cardapio', () => {
  let harness: RouterTestingHarness;
  let availableMenus: Awaited<ReturnType<StaticMenuSource['loadMenus']>>;

  beforeEach(async () => {
    availableMenus = await new StaticMenuSource().loadMenus();
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'cardapios/:slug', component: Cardapio }, { path: '**', component: Cardapio }]),
        { provide: MENU_SOURCE, useValue: { loadMenus: () => Promise.resolve(availableMenus) } },
      ],
    }).compileComponents();
    harness = await RouterTestingHarness.create();
  });

  async function go(url: string): Promise<HTMLElement> {
    await harness.navigateByUrl(url, Cardapio);
    await harness.fixture.whenStable();
    harness.detectChanges();
    return harness.routeNativeElement as HTMLElement;
  }

  it.each(['italiano', 'churrasco', 'contemporaneo'])(
    'renderiza título, categorias e pratos de %s na ordem da fonte',
    async (slug) => {
      const menus = await new StaticMenuSource().loadMenus();
      const menu = menus.find((entry) => entry.slug === slug);
      expect(menu).toBeDefined();

      const element = await go(`/cardapios/${slug}`);
      const content = element.querySelector('.menu-content');
      const headings = [...element.querySelectorAll('.menu-category h2')].map((heading) => heading.textContent?.trim());
      const dishes = [...element.querySelectorAll('.menu-category li')].map((item) => item.textContent?.trim());

      expect(element.querySelector('h1')?.textContent?.trim()).toBe(menu?.title);
      expect(content?.querySelector('header.menu-header h1')).toBeTruthy();
      expect(content?.querySelector('.menu-cycle')).toBeTruthy();
      expect(content?.querySelector('.menu-sections')).toBeTruthy();
      expect(getComputedStyle(content!).textAlign).toBe('center');
      expect(getComputedStyle(element.querySelector('.menu-category h2')!).textAlign).toBe('center');
      expect(getComputedStyle(element.querySelector('.menu-category li')!).textAlign).toBe('center');
      expect(getComputedStyle(element.querySelector('.menu-category li')!).borderBottomStyle).toBe('none');
      expect(getComputedStyle(element.querySelector('.menu-category li')!).paddingBlock).toBe('0.55rem');
      expect(headings).toEqual(menu?.categories.map((category) => category.name));
      expect(dishes).toEqual(menu?.categories.flatMap((category) => category.dishes.map((dish) => dish.name)));
      expect(element.textContent).not.toMatch(/R\$\s*\d/);
    },
  );

  it('apresenta os dois CTAs juntos em uma seção própria e mantém navegação entre cardápios', async () => {
    const element = await go('/cardapios/italiano');
    const links = [...element.querySelectorAll('a')].map((link) => link.getAttribute('href'));

    expect(links).toContain('/cardapios/churrasco');
    expect(links).toContain('/cardapios/contemporaneo');
    expect(links).not.toContain('/cardapios/italiano');
    const section = element.querySelector('.quote-entry');
    expect(section?.querySelectorAll('button')).toHaveLength(2);
    expect(section?.textContent).toContain('Solicitar orçamento deste cardápio');
    expect(section?.textContent).toContain('Montar meu próprio cardápio');
    expect(element.querySelector('.how-to, .other-menus')).toBeNull();
  });

  it('navega circularmente conforme a quantidade atual de cardápios', async () => {
    const allMenus = availableMenus;
    availableMenus = allMenus.filter((menu) => ['italiano', 'churrasco'].includes(menu.slug));
    const element = await go('/cardapios/italiano');

    expect(element.querySelector('.cycle-previous')?.getAttribute('href')).toBe('/cardapios/churrasco');
    expect(element.querySelector('.cycle-next')?.getAttribute('href')).toBe('/cardapios/churrasco');
  });

  it('volta da página para a seção de cardápios na Home', async () => {
    const element = await go('/cardapios/italiano');
    const backLink = element.querySelector<HTMLAnchorElement>('.back-link');

    expect(backLink?.textContent).toContain('Voltar aos cardápios');
    expect(backLink?.getAttribute('href')).toBe('/#cardapios');
  });

  it('navega pelo gesto horizontal sem tratar o scroll vertical como troca', async () => {
    const element = await go('/cardapios/italiano');
    const page = element.querySelector<HTMLElement>('.menu-page')!;
    const touchEvent = (type: string, x: number, y: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, 'changedTouches', { value: [{ clientX: x, clientY: y }] });
      return event;
    };

    page.dispatchEvent(touchEvent('touchstart', 200, 30));
    page.dispatchEvent(touchEvent('touchend', 190, 140));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Italiano');

    page.dispatchEvent(touchEvent('touchstart', 200, 30));
    page.dispatchEvent(touchEvent('touchend', 100, 35));
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Churrasco');
  });

  it('exibe estado não encontrado com noindex e caminhos de retorno', async () => {
    const element = await go('/cardapios/desconhecido');
    const meta = TestBed.inject(Meta);

    expect(element.querySelector('h1')?.textContent).toContain('Cardápio não encontrado');
    expect(meta.getTag('name="robots"')?.content).toBe('noindex');
    expect([...element.querySelectorAll('.not-found-actions a')].map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/#cardapios',
    ]);
  });

  it('remove o noindex ao voltar para um cardápio válido', async () => {
    await go('/cardapios/desconhecido');
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('name="robots"')?.content).toBe('noindex');

    await go('/cardapios/italiano');
    expect(meta.getTag('name="robots"')).toBeNull();
  });
});
