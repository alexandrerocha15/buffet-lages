import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly menuOpen = signal(false);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.menuOpen.set(false);
        if (this.browser) {
          requestAnimationFrame(() => {
            const target = document.getElementById(this.router.parseUrl(this.router.url).fragment ?? 'conteudo');
            target?.focus({ preventScroll: true });
            if (target && target.id !== 'conteudo') target.scrollIntoView();
          });
        }
      });
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.menuOpen()) {
      this.closeMenu();
      (event.currentTarget as HTMLElement).parentElement?.querySelector('button')?.focus();
    }
  }
}
