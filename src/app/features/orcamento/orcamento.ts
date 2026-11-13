import { ChangeDetectionStrategy, Component, computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_SOURCE } from '../../core/content/menu-source';
import { QuoteStore } from '../../core/quote/quote-store';
import { buildQuoteMessage, buildWhatsAppUrl, validEventDate, validEventLocation } from '../../core/quote/whatsapp';
import type { EventDate, EventLocation } from '../../core/quote/quote-store';
import type { Menu } from '../../core/models';
import type { CatalogCategory } from '../../core/models';
import { environment } from '../../../environments/environment';
import { NgbDatepickerI18n, NgbDatepickerModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import type { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
class PortugueseDatepickerI18n extends NgbDatepickerI18n {
  private readonly months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2020, index, 1))));
  getWeekdayLabel(weekday: number): string { return ['seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.', 'dom.'][weekday - 1] ?? ''; }
  getMonthShortName(month: number): string { return this.months[month - 1]?.slice(0, 3) ?? ''; }
  getMonthFullName(month: number): string { const name = this.months[month - 1] ?? ''; return name.charAt(0).toLocaleUpperCase('pt-BR') + name.slice(1); }
  override getMonthLabel(date: NgbDateStruct): string { return `${this.getMonthFullName(date.month)} ${date.year}`; }
  getDayAriaLabel(date: NgbDateStruct): string { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(Date.UTC(date.year, date.month - 1, date.day))); }
}

@Component({ selector: 'app-orcamento', imports: [NgbDatepickerModule], providers: [{ provide: NgbDatepickerI18n, useClass: PortugueseDatepickerI18n }], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './orcamento.html', styleUrl: './orcamento.css' })
export class Orcamento {
  private readonly router = inject(Router);
  protected readonly store = inject(QuoteStore);
  protected readonly menus = signal<readonly Menu[]>([]);
  protected readonly catalog = signal<readonly CatalogCategory[]>([]);
  protected readonly entrySelected = signal(this.router.url.split('?')[0] === '/montar' || !!this.store.baseMenu());
  protected readonly activeCategory = signal('');
  protected readonly categories = computed<readonly CatalogCategory[]>(() => {
    const baseMenuSlug = this.store.origin() === 'pronto' ? this.store.baseMenu()?.slug : undefined;
    return this.catalog().map((category) => ({
      name: category.name,
      dishes: category.dishes.filter((dish) => !baseMenuSlug || dish.menus.includes(baseMenuSlug)),
    })).filter((category) => category.dishes.length > 0);
  });
  protected readonly selectedCategory = computed(() => this.categories().find((category) => category.name === this.activeCategory()) ?? this.categories()[0] ?? null);
  protected readonly error = signal(''); protected readonly specialInput = signal(''); protected readonly confirmed = signal(false);
  protected readonly editingSpecial = signal<number | null>(null);
  protected readonly specialDraft = signal('');
  protected readonly today = this.startOfToday();
  protected readonly message = computed(() => buildQuoteMessage(this.store.details(), this.store.origin(), this.store.baseMenu(), this.store.dishes(), this.store.specials()));
  protected readonly url = computed(() => buildWhatsAppUrl(environment.whatsappNumber, this.message()));
  protected readonly longMessage = computed(() => this.url().length > environment.whatsappMessageLimit);
  constructor() {
    const source = inject(MENU_SOURCE);
    void Promise.all([source.loadMenus(), source.loadCatalog()]).then(([menus, catalog]) => {
      this.menus.set(menus);
      this.catalog.set(catalog);
      this.activeCategory.set(this.categories()[0]?.name ?? '');
    });
    effect(() => {
      const categories = this.categories();
      if (categories.length && !categories.some((category) => category.name === this.activeCategory())) this.activeCategory.set(categories[0]!.name);
    });
  }
  protected start(menu: Menu): void { this.store.startMenu(menu); this.entrySelected.set(true); this.activeCategory.set(menu.categories[0]?.name ?? ''); }
  protected startCustom(): void { this.store.startCustom(); this.entrySelected.set(true); this.activeCategory.set(this.categories()[0]?.name ?? ''); }
  protected expandCatalog(): void { this.store.origin.set('personalizado'); this.activeCategory.set(this.categories()[0]?.name ?? ''); }
  protected selectCategory(category: string): void { this.activeCategory.set(category); }
  protected onCategoryKeydown(event: KeyboardEvent): void {
    const categories = this.categories();
    const focused = Number((event.target as HTMLElement).closest('[role="tab"]')?.getAttribute('data-index'));
    const index = Number.isInteger(focused) && focused >= 0
      ? focused
      : categories.findIndex((category) => category.name === this.activeCategory());
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;
    if (event.eventPhase !== 0) event.preventDefault();
    const category = categories[next];
    if (category) { this.activeCategory.set(category.name); setTimeout(() => document.getElementById(`category-tab-${next}`)?.focus(), 0); }
  }
  private focusStep(): void { setTimeout(() => document.getElementById('quote-step-title')?.focus(), 0); }
  protected toSelection(): void { this.store.step.set('selection'); this.error.set(''); this.focusStep(); }
  protected toPreview(): void { if (!this.store.canContinue()) { this.fail('Adicione ao menos um prato ou pedido especial válido.', 'special'); return; } this.error.set(''); this.store.step.set('preview'); this.focusStep(); }
  protected addSpecialFromInput(): void { if (this.store.addSpecial(this.specialInput())) this.specialInput.set(''); }
  protected onSpecialEnter(event: Event): void {
    // Replay já ocorreu após a ação original do navegador; preventDefault nesse replay lança erro no Angular.
    if (event.eventPhase !== 0) event.preventDefault();
    const value = (event.target as HTMLInputElement).value;
    if (this.store.addSpecial(value)) {
      this.specialInput.set('');
      (event.target as HTMLInputElement).value = '';
    }
  }
  protected editSpecial(index: number): void { this.editingSpecial.set(index); this.specialDraft.set(this.store.specials()[index] ?? ''); setTimeout(() => document.getElementById(`special-edit-${index}`)?.focus(), 0); }
  protected saveSpecial(index: number): void { if (this.editingSpecial() !== index) return; this.store.editSpecial(index, this.specialDraft()); this.editingSpecial.set(null); }
  protected onSpecialEditKeydown(event: KeyboardEvent, index: number): void { if (event.key === 'Enter') { event.preventDefault(); this.saveSpecial(index); } else if (event.key === 'Escape') { this.editingSpecial.set(null); } }
  protected setDefinedDate(value: NgbDateStruct | undefined): void {
    if (!value) return;
    const year = value.year;
    const month = String(value.month).padStart(2, '0');
    const day = String(value.day).padStart(2, '0');
    this.setDetail('date', { kind: 'defined', iso: `${year}-${month}-${day}` });
  }
  protected definedDate(): string {
    const date = this.store.details().date;
    if (date.kind !== 'defined' || !date.iso) return '';
    const [year, month, day] = date.iso.split('-');
    return `${day}/${month}/${year}`;
  }
  protected todayStruct(): NgbDateStruct { return { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }; }
  protected openDatepicker(picker: NgbInputDatepicker): void {
    picker.toggle();
    setTimeout(() => {
      document.querySelector('.ngb-dp-arrow-prev button')?.setAttribute('aria-label', 'Mês anterior');
      document.querySelector('.ngb-dp-arrow-prev button')?.setAttribute('title', 'Mês anterior');
      document.querySelector('.ngb-dp-arrow-next button')?.setAttribute('aria-label', 'Próximo mês');
      document.querySelector('.ngb-dp-arrow-next button')?.setAttribute('title', 'Próximo mês');
    }, 0);
  }
  protected reviewLocation(): string {
    const location = this.store.details().location;
    return location.kind === 'unknown' ? 'Local ainda não definido' : [location.city, location.venue, location.address].filter((value) => !!value).join(' · ');
  }
  private startOfToday(): Date { const today = new Date(); today.setHours(0, 0, 0, 0); return today; }
  protected nextDetails(): void { this.store.step.set('details'); this.focusStep(); }
  protected nextReview(): void {
    const value = this.store.details();
    if (!value.name.trim()) return this.fail('Informe seu nome.', 'guest-name');
    if (!/^\d+$/.test(value.guests) || Number(value.guests) < 1) return this.fail('Informe uma quantidade inteira de convidados maior que zero.', 'guest-count');
    if (!validEventDate(value.date)) return this.fail('Escolha uma data válida, que não esteja no passado.', 'event-date');
    if (!validEventLocation(value.location)) return this.fail('Informe a cidade do evento.', 'event-city');
    this.error.set(''); this.store.step.set('review'); this.focusStep();
  }
  private fail(message: string, targetId: string): void { this.error.set(message); setTimeout(() => document.getElementById(targetId)?.focus(), 0); }
  protected dateKind(kind: EventDate['kind']): void { this.store.details.update((d) => ({ ...d, date: kind === 'unknown' ? { kind } : kind === 'defined' ? { kind, iso: '' } : { kind, month: new Date().getMonth() + 1, year: new Date().getFullYear() } })); }
  protected locationKind(kind: EventLocation['kind']): void { this.store.details.update((d) => ({ ...d, location: kind === 'unknown' ? { kind } : { kind, city: '' } })); }
  protected setDetail<K extends keyof ReturnType<QuoteStore['details']>>(key: K, value: ReturnType<QuoteStore['details']>[K]): void { this.store.details.update((d) => ({ ...d, [key]: value })); }
  protected openWhatsApp(): void { if (!this.confirmed()) return; window.open(this.longMessage() ? buildWhatsAppUrl(environment.whatsappNumber, '') : this.url(), '_blank', 'noopener'); }
  protected async copy(): Promise<void> { try { await navigator.clipboard.writeText(this.message()); this.error.set('Resumo copiado.'); } catch { this.error.set('Não foi possível copiar automaticamente. Selecione e copie o resumo exibido.'); } }
  protected returnHome(): void { void this.router.navigateByUrl('/'); }
}
