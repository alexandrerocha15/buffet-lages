import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TransferState,
  afterNextRender,
  computed,
  inject,
  makeStateKey,
  resource,
  signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MENU_SOURCE } from '../../core/content/menu-source';
import type { Menu } from '../../core/models';

const HOME_MENU_ORDER = ['italiano', 'churrasco', 'contemporaneo'] as const;
const MENUS_STATE_KEY = makeStateKey<readonly Menu[]>('home-menus');

const HERO_SLIDES = [
  { image: 'mesa-frios', alt: 'Mesa de frios com queijos, pães e petiscos organizados para um evento', width: 1448, height: 1086 },
  { image: 'mesa-frutas-saladas', alt: 'Mesa com saladas, frutas e arranjos florais', width: 1086, height: 1448 },
  { image: 'mesa-richots', alt: 'Pratos quentes apresentados em rechauds, com pessoas ao fundo', width: 1448, height: 1086 },
] as const;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly menuSource = inject(MENU_SOURCE);
  private readonly transferState = inject(TransferState);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);
  private rotationTimer: ReturnType<typeof setInterval> | undefined;
  protected readonly heroSlides = HERO_SLIDES;
  protected readonly activeSlide = signal(0);
  protected readonly rotationPaused = signal(false);
  protected readonly hasChangedSlide = signal(false);

  constructor() {
    afterNextRender(() => {
      const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      const updateRotation = () => {
        if (this.rotationTimer) clearInterval(this.rotationTimer);
        this.rotationTimer = undefined;
        if (!motionPreference?.matches && !this.rotationPaused()) {
          this.rotationTimer = setInterval(() => this.showNext(), 7000);
        }
      };
      motionPreference?.addEventListener('change', updateRotation);
      updateRotation();
      this.destroyRef.onDestroy(() => {
        if (this.rotationTimer) clearInterval(this.rotationTimer);
        motionPreference?.removeEventListener('change', updateRotation);
      });
    });
    this.titleService.setTitle('Buffet Lages — Cardápios e apresentação');
    this.metaService.updateTag({
      name: 'description',
      content: 'Conheça o Buffet Lages, seus três cardápios e solicite um orçamento para o seu evento.',
    });
    this.metaService.removeTag('name="robots"');
  }

  protected readonly menus = resource({
    id: MENUS_STATE_KEY,
    params: () => 'static',
    defaultValue: this.transferState.get(MENUS_STATE_KEY, [] as readonly Menu[]),
    loader: () => this.menuSource.loadMenus(),
  });

  protected readonly featuredMenus = computed<readonly Menu[]>(() => {
    const menus = this.menus.value() ?? [];
    return HOME_MENU_ORDER.map((slug) => menus.find((menu) => menu.slug === slug)).filter(
      (menu): menu is Menu => menu !== undefined,
    );
  });

  protected menuLabel(menu: Menu): string {
    return menu.title.replace(/^Cardápio\s+/i, '');
  }

  protected showPrevious(): void {
    this.activeSlide.update((index) => (index - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    this.hasChangedSlide.set(true);
  }

  protected showNext(): void {
    this.activeSlide.update((index) => (index + 1) % HERO_SLIDES.length);
    this.hasChangedSlide.set(true);
  }

  protected selectSlide(index: number): void {
    this.activeSlide.set(index);
    this.hasChangedSlide.set(true);
  }

  protected toggleRotation(): void {
    this.rotationPaused.update((paused) => !paused);
    if (this.rotationPaused() && this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = undefined;
    } else if (!(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)) {
      this.rotationTimer = setInterval(() => this.showNext(), 7000);
    }
  }

  protected onHeroKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNext();
    }
  }

  protected onHeroTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  protected onHeroTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX;
    if (this.touchStartX === null || endX === undefined) return;
    const distance = endX - this.touchStartX;
    if (Math.abs(distance) > 48) {
      if (distance < 0) this.showNext();
      else this.showPrevious();
    }
    this.touchStartX = null;
  }

  private touchStartX: number | null = null;

}
