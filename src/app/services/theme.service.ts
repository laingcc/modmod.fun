import { Injectable } from '@angular/core';

export type Theme = {name:string, value:string}

@Injectable({
  providedIn: 'root',

})
export class ThemeService {
  private readonly THEME_KEY = 'selectedTheme';

  themes = [
    { name: 'Terminal', value: 'terminal' },
    { name: 'Synthwave', value: 'terminal-synthwave' },
    { name: 'GTech Dark', value: 'terminal-gtech-dark' },
    { name: 'GTech Light', value: 'terminal-gtech-light' },
  ];

  constructor() {
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);
  }

  setTheme(theme: string): void {
    document.body.className = theme;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getSavedTheme(): string {
    return localStorage.getItem(this.THEME_KEY)|| this.themes[0].value;
  }
}
