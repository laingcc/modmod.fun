import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-reply-modal',
  standalone: true,
  imports: [],
  templateUrl: './reply-modal.component.html',
  styleUrl: './reply-modal.component.scss'
})
export class ReplyModalComponent {

  public constructor(
    private dialogRef: MatDialogRef<ReplyModalComponent>
  ) {
  }

  sendComment() {
    // Logic to send the comment
    console.log('Comment sent');

    this.dialogRef.close();

  }
}
