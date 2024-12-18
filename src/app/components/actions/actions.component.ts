import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ReplyModalComponent} from "../reply-modal/reply-modal.component";

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  constructor(
    private dialog: MatDialog
  ) {
  }
  reply() {
      this.dialog.open(ReplyModalComponent);
    }
}
