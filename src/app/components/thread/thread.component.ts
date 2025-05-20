import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Thread} from "../../services/thread.service";
import {CommentComponent, ThreadComment} from "../comment/comment.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {ActionsComponent} from "../actions/actions.component";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommentComponent,
    NgForOf,
    AsyncPipe,
    ActionsComponent,
    MarkdownComponent,
    NgIf
  ],
  providers:[],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent{

  @Input() threadData: Observable<Thread>
  @Input() threadId: number;

  @Output() Comment = new EventEmitter<ThreadComment>()

  constructor(
  ) {
  }

  onComment(comment: ThreadComment){
    this.Comment.emit(comment)
  }

  getRootComments(comments: ThreadComment[]): ThreadComment[] {
    return comments.filter(comment => !comment.parentId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getChildComments(comments: ThreadComment[], parentId: number): ThreadComment[] {
    return comments.filter(comment => comment.parentId === parentId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }


  getAllDescendants(comments: ThreadComment[], parentId: number): ThreadComment[] {
    const descendants: ThreadComment[] = [];
    const stack = comments.filter(comment => comment.parentId === parentId);

    while (stack.length > 0) {
      const current = stack.pop();
      if (current) {
        descendants.push(current);
        stack.push(...comments.filter(comment => comment.parentId === current.id));
      }
    }

    return descendants.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
