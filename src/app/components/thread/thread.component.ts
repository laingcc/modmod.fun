import {Component, Input, OnInit} from '@angular/core';
import {LoremIpsum} from "lorem-ipsum";
import {Thread, ThreadService} from "../../services/thread.service";
import {CommentComponent} from "../comment/comment.component";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommentComponent,
    NgForOf,
    AsyncPipe
  ],
  providers:[ThreadService],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent{

  @Input() threadData: Observable<any>

  constructor(
    private threadService: ThreadService
  ) {
  }

}
