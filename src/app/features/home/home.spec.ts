import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MENU_SOURCE } from '../../core/content/menu-source';
import { StaticMenuSource } from '../../core/content/static-menu-source';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), { provide: MENU_SOURCE, useClass: StaticMenuSource }],
    }).compileComponents();
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('apresenta os três cardápios na ordem definida com títulos simples', async () => {
    const element = await render();
    const menus = await new StaticMenuSource().loadMenus();
    const expected = ['Italiano', 'Churrasco', 'Contemporâneo'];
    const titles = [...element.querySelectorAll('.menu-card h3')].map((heading) =>
      heading.textContent?.trim(),
    );

    expect(titles).toEqual(expected);
    expect(menus).toHaveLength(3);
    expect(
      [...element.querySelectorAll('.menu-card a')].map((link) => link.getAttribute('href')),
    ).toEqual(['/cardapios/italiano', '/cardapios/churrasco', '/cardapios/contemporaneo']);
  });

  it('mantém hero prioritário e fotografias secundárias com carregamento preguiçoso', async () => {
    const element = await render();
    const hero = element.querySelector('.hero img');
    const gallery = [...element.querySelectorAll('.photo-grid img')];

    expect(hero?.getAttribute('fetchpriority')).toBe('high');
    expect(hero?.getAttribute('loading')).toBe('eager');
    expect(hero?.getAttribute('width')).toBe('1448');
    expect(hero?.getAttribute('height')).toBe('1086');
    expect(gallery).toHaveLength(2);
    expect(gallery.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
    expect(
      gallery.every((image) => image.getAttribute('width') && image.getAttribute('height')),
    ).toBe(true);
  });

  it('oferece as três fotos institucionais e controles acessíveis de carrossel', async () => {
    const element = await render();
    const carousel = element.querySelector('[aria-roledescription="carrossel"]');
    const slides = [...element.querySelectorAll('.hero-photo img')];

    expect(carousel).toBeTruthy();
    expect(slides).toHaveLength(3);
    expect(slides.every((image) => image.getAttribute('src')?.startsWith('img/'))).toBe(true);
    expect(slides.every((image) => image.getAttribute('alt'))).toBe(true);
    expect(element.querySelector('[aria-label="Fotografia anterior"]')).toBeNull();
    expect(element.querySelector('[aria-label="Próxima fotografia"]')).toBeNull();
    expect(element.querySelectorAll('.carousel-indicator')).toHaveLength(3);
    expect(element.querySelector('.carousel-indicator.is-current')).toBeTruthy();
    expect(
      [...element.querySelectorAll<HTMLButtonElement>('.carousel-indicator')].every(
        (button) => button.tabIndex === 0,
      ),
    ).toBe(true);
    expect(element.querySelector('.rotation-control')?.textContent).toContain('Pausar reprodução');
  });

  it('permite selecionar slides diretamente por teclado e indicadores', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const indicator = element.querySelector<HTMLButtonElement>(
      '[aria-label="Mostrar fotografia 2 de 3"]',
    )!;

    indicator.click();
    fixture.detectChanges();
    expect(
      element
        .querySelectorAll('.hero-photo.is-active')[0]
        ?.querySelector('img')
        ?.getAttribute('alt'),
    ).toContain('saladas');

    const thirdIndicator = element.querySelector<HTMLButtonElement>(
      '[aria-label="Mostrar fotografia 3 de 3"]',
    )!;
    thirdIndicator.focus();
    thirdIndicator.click();
    fixture.detectChanges();
    expect(
      element
        .querySelectorAll('.hero-photo.is-active')[0]
        ?.querySelector('img')
        ?.getAttribute('alt'),
    ).toContain('rechauds');
  });

  it('oferece acesso ao fluxo de orçamento disponível', async () => {
    const element = await render();
    const links = [...element.querySelectorAll('a')];
    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('#como-funciona');
    expect(element.querySelector('#como-funciona')).toBeTruthy();
    expect(element.querySelector('a[href="/orcamento"]')).toBeTruthy();
  });

  it('não exibe preços nem descrições de pratos inventadas', async () => {
    const element = await render();
    const text = element.textContent ?? '';

    expect(text).not.toMatch(/R\$\s*\d/);
    expect(element.querySelectorAll('.menu-card p')).toHaveLength(0);
  });
});
