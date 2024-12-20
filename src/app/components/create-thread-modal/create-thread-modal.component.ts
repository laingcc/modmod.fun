import { Component } from '@angular/core';
import { ThreadService, Thread } from '../../services/thread.service';
import {FormsModule, NgForm} from '@angular/forms';

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

  constructor(private threadService: ThreadService) {}

  onSubmit() {
    this.threadService.createThread(this.thread).subscribe(response => {
      console.log('Thread created:', response);
      // Close the modal or reset the form as needed
    });
  }
}
