import {
  ChangeDetectionStrategy,
  Component,
  TransferState,
  computed,
  effect,
  inject,
  makeStateKey,
  resource,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MENU_SOURCE } from '../../core/content/menu-source';
import type { Menu } from '../../core/models';

const MENU_PRESENTATION_ORDER = ['italiano', 'churrasco', 'contemporaneo'] as const;
const MENUS_STATE_KEY = makeStateKey<readonly Menu[]>('cardapio-menus');

@Component({
  selector: 'app-cardapio',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css',
})
export class Cardapio {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuSource = inject(MENU_SOURCE);
  private readonly transferState = inject(TransferState);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' },
  );

  protected readonly menus = resource({
    id: MENUS_STATE_KEY,
    params: () => 'static',
    defaultValue: this.transferState.get(MENUS_STATE_KEY, [] as readonly Menu[]),
    loader: () => this.menuSource.loadMenus(),
  });

  protected readonly menu = computed<Menu | null>(
    () => this.menus.value()?.find((menu) => menu.slug === this.slug()) ?? null,
  );

  protected readonly presentationMenus = computed<readonly Menu[]>(() => {
    const menus = this.menus.value() ?? [];
    const ordered = MENU_PRESENTATION_ORDER
      .map((slug) => menus.find((menu) => menu.slug === slug))
      .filter((menu): menu is Menu => menu !== undefined);
    return [...ordered, ...menus.filter((menu) => !ordered.some((item) => item.slug === menu.slug))];
  });

  protected readonly otherMenus = computed<readonly Menu[]>(() =>
    this.presentationMenus().filter((menu) => menu.slug !== this.slug()),
  );

  protected readonly previousMenu = computed<Menu | null>(() => this.adjacentMenu(-1));
  protected readonly nextMenu = computed<Menu | null>(() => this.adjacentMenu(1));

  private touchStart: { x: number; y: number } | null = null;

  protected onTouchStart(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    if (touch) this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  protected onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    if (!touch || !this.touchStart) return;
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    this.touchStart = null;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    const target = deltaX < 0 ? this.nextMenu() : this.previousMenu();
    if (target) void this.router.navigate(['/cardapios', target.slug]);
  }

  private adjacentMenu(offset: -1 | 1): Menu | null {
    const menus = this.presentationMenus();
    if (menus.length < 2) return null;
    const index = menus.findIndex((menu) => menu.slug === this.slug());
    if (index < 0) return null;
    return menus[(index + offset + menus.length) % menus.length] ?? null;
  }

  constructor() {
    effect(() => {
      if (this.menus.isLoading()) return;

      const menu = this.menu();
      this.metaService.removeTag('name="robots"');

      if (menu) {
        this.titleService.setTitle(`${menu.title} — Buffet Lages`);
        this.metaService.updateTag({
          name: 'description',
          content: `Categorias e pratos do ${menu.title} do Buffet Lages.`,
        });
        return;
      }

      this.titleService.setTitle('Cardápio não encontrado — Buffet Lages');
      this.metaService.updateTag({
        name: 'description',
        content: 'O cardápio solicitado não foi encontrado. Volte à página inicial para conhecer os cardápios disponíveis.',
      });
      this.metaService.updateTag({ name: 'robots', content: 'noindex' });
    });
  }
}
