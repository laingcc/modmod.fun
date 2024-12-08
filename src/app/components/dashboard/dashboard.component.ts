import { Component } from '@angular/core';
import {ThreadComponent} from "../thread/thread.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ThreadComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
