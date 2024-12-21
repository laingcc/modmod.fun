import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ReplyModalComponent} from "../reply-modal/reply-modal.component";
import {ThreadComment} from "../comment/comment.component";

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  @Output() Comment = new EventEmitter<ThreadComment>()
  constructor(
    private dialog: MatDialog
  ) {
  }
  reply() {
    this.dialog.open(ReplyModalComponent).afterClosed().subscribe((comment: ThreadComment) => {
        if (comment) {
          this.Comment.emit(comment)
        }
      }
    )
  }
}
