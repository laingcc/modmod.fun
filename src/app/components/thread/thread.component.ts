import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Thread} from "../../services/thread.service";
import {CommentComponent, ThreadComment} from "../comment/comment.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {ActionsComponent} from "../actions/actions.component";
import {MarkdownComponent} from "ngx-markdown";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommentComponent,
    NgForOf,
    AsyncPipe,
    ActionsComponent,
    MarkdownComponent,
    NgIf,
    FormsModule // Add FormsModule for two-way binding
  ],
  providers:[],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Input() threadData: Observable<Thread>;
  @Input() threadId: number;

  @Output() Comment = new EventEmitter<ThreadComment>();

  onlyOp: boolean = false; // Track the state of the "Only OP" checkbox
  filteredComments: ThreadComment[] = []; // Store filtered comments

  constructor() {}

  ngOnChanges(): void {
    this.threadData?.subscribe(thread => {
      this.filteredComments = this.getRootComments(thread.comments);
    });
  }

  onComment(comment: ThreadComment): void {
    this.Comment.emit(comment);
  }

  filterComments(): void {
    this.threadData?.subscribe(thread => {
      if (this.onlyOp) {
        this.filteredComments = this.getRootComments(thread.comments).filter(
          comment => comment.author === thread.author
        );
      } else {
        this.filteredComments = this.getRootComments(thread.comments);
      }
    });
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
