import {Component, OnInit} from '@angular/core';
import {ThreadComponent} from "../thread/thread.component";
import {ThreadService} from "../../services/thread.service";
import {Observable} from "rxjs";
import {AsyncPipe, SlicePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ThreadComment} from "../comment/comment.component";

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
export class DashboardComponent implements OnInit {

  threadData: Observable<any>
  id: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private threadService: ThreadService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = +(params.get('id') ?? -1);
      this.threadData = this.threadService.getThread(this.id);
    })
  }

  addComment(comment: ThreadComment){
    this.threadService.addComment(this.id, comment).subscribe(response => {
      console.log('Comment added:', response);
    });
  }


}
