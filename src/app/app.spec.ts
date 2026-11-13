import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

@Component({ template: '<h1>Página de teste</h1>' })
class TestPage {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: '', component: TestPage }])],
    }).compileComponents();
  });

  it('creates the root application shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('main#conteudo')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.skip-link')?.textContent).toContain('Pular');
  });

  it('opens and closes the mobile menu by button and Escape', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.menu-toggle');
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');

    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('is-open')).toBe(true);

    nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('moves focus to the main content on navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const previous = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    try {
      await TestBed.inject(Router).navigateByUrl('/');
      fixture.detectChanges();
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#conteudo'));
    } finally {
      globalThis.requestAnimationFrame = previous;
    }
  });

  it('offers navigation to the active quote flow', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('nav a'));
    expect(links.map((link) => new URL(link.href).pathname + new URL(link.href).hash)).toEqual([
      '/',
      '/#cardapios',
      '/orcamento',
    ]);
    expect(fixture.nativeElement.querySelector('a[href="/orcamento"]')).toBeTruthy();
  });
});
