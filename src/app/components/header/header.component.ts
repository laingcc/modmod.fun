import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import {Theme, ThemeService} from '../../services/theme.service';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule, NgForOf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  activeLink: string = '';
  width = 0;

  themes: Theme[]

  theme:string;

  constructor(private router: Router, public themeService: ThemeService) {
    this.themes = this.themeService.themes;
    this.theme = this.themeService.getSavedTheme()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects.split(';')[0];
        setTimeout(() => {
          this.setWidth();
        });
      }
    });
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  setWidth() {
    const ActiveElement = document.querySelector('.active');
    this.width = ActiveElement
      ? ActiveElement.getBoundingClientRect().x + ActiveElement.clientWidth / 2
      : 200;

    (document.querySelector('.header-container') as HTMLElement)?.style.setProperty(
      '--active-width',
      `${this.width - 100}px`
    );
  }

  switchTheme(): void {
    this.themeService.setTheme(this.theme);
  }
}

