import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-heads-up-banner',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './heads-up-banner.component.html',
  styleUrl: './heads-up-banner.component.scss'
})
export class HeadsUpBannerComponent {

}
