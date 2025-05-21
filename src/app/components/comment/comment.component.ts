import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {ActionsComponent} from "../actions/actions.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {MarkdownComponent} from "ngx-markdown";


export type ThreadComment = {
  author: string,
  content: string,
  date: Date,
  id: number,
  feverCount: number,
  parentId?: number,
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    ActionsComponent,
    NgIf,
    TripcodePillComponent,
    MarkdownComponent,
    DatePipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() Comment: ThreadComment = {
    author: '',
    content: '',
    date: new Date(),
    id: 0,
    feverCount: 0
  };

  @Input() isOp: boolean = false;

  @Input() quoteNumber?: number;

  @Output() parentComment = new EventEmitter<ThreadComment>();

  onComment(comment: ThreadComment) {
    comment.parentId = this.Comment.id;
    this.parentComment.next(comment);
  }

  scrollToComment(commentId: number): void {
    const element = document.getElementById(`comment-${commentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

