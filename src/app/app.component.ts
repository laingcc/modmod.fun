import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fever';

  constructor(private router: Router, private themeService: ThemeService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.playNavigationSound();
      }
    });

    // Initialize the theme using ThemeService
    const savedTheme = this.themeService.getSavedTheme();
    if (savedTheme) {
      this.themeService.setTheme(savedTheme);
    } else {
      this.themeService.setTheme('terminal-synthwave'); // Default theme
    }
  }

  private playNavigationSound(): void {
    const audio = new Audio('assets/terminal_click.wav');
    audio.play();
  }
}
