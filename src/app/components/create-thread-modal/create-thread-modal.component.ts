import { Component } from '@angular/core';
import { ThreadService, Thread } from '../../services/thread.service';
import {FormsModule, NgForm} from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-thread-modal',
  templateUrl: './create-thread-modal.component.html',
  styleUrls: ['./create-thread-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
  ]
})
export class CreateThreadModalComponent {
  thread: Thread = {
    id: 0,
    title: '',
    author: '',
    date: '',
    description: '',
    comments: []
  };

  constructor(
    private threadService: ThreadService,
    private dialogRef: MatDialogRef<CreateThreadModalComponent>
  ) {}

  onSubmit() {

    this.dialogRef.close(this.thread);

  }
}
