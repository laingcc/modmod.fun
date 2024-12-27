import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoremIpsum} from "lorem-ipsum";
import {Thread, ThreadService} from "../../services/thread.service";
import {CommentComponent, ThreadComment} from "../comment/comment.component";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable} from "rxjs";
import {ActionsComponent} from "../actions/actions.component";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommentComponent,
    NgForOf,
    AsyncPipe,
    ActionsComponent
  ],
  providers:[ThreadService],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent{

  @Input() threadData: Observable<any>
  @Input() threadId: number;

  @Output() Comment = new EventEmitter<ThreadComment>()

  constructor(
    private threadService: ThreadService
  ) {
  }

  onComment(comment: ThreadComment){
    this.Comment.emit(comment)
  }
}
