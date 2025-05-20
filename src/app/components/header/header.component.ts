import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule], // Add RouterModule here
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  activeLink: string = '';
  width = 0;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event)
        this.activeLink = event.urlAfterRedirects.split(';')[0];
        setTimeout(() => {
          this.setWidth();
        })
      }
    });
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  hasActive(){
    return this.activeLink === ''
  }

  setWidth() {
    const ActiveElement = document.querySelector('.active');
    console.log(ActiveElement)
    this.width = ActiveElement ? (ActiveElement.getBoundingClientRect().x + ActiveElement.clientWidth/2): 200;

    (document.querySelector('.header-container') as HTMLElement)
      ?.style.setProperty('--active-width', `${this.width - 100}px`);

  }
}
