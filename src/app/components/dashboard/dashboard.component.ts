import { Component } from '@angular/core';
import {ThreadComponent} from "../thread/thread.component";
import {ThreadService} from "../../services/thread.service";
import {Observable} from "rxjs";
import {AsyncPipe, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ThreadComponent,
    AsyncPipe,
    SlicePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  threadData: Observable<any>
  constructor(
    private threadService: ThreadService
  ) {
    this.threadData = this.threadService.getThread(1)
    this.threadData.subscribe(t => console.log(t))
  }

}
