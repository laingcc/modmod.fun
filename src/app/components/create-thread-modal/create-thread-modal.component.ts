import {ChangeDetectorRef, Component} from '@angular/core';
import { ThreadService, Thread } from '../../services/thread.service';
import {FormsModule, NgForm} from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import {AsyncPipe, NgIf} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";

export interface CreateThreadReturn {
  thread: Thread;
  image: File;
}
@Component({
  selector: 'app-create-thread-modal',
  templateUrl: './create-thread-modal.component.html',
  styleUrls: ['./create-thread-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    MarkdownComponent,
    NgIf,
  ]
})
export class CreateThreadModalComponent {
  thread: Thread = {
    id: 0,
    title: '',
    author: '',
    date: '',
    description: '',
    comments: [],
    imageId: ''
  };


  constructor(
    private threadService: ThreadService,
    private dialogRef: MatDialogRef<CreateThreadModalComponent, CreateThreadReturn>,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.dialogRef.close({thread: this.thread, image: this.selectedFile});

  }

  onPost(form:any){
    if (form.checkValidity()){
      this.onSubmit();
    }
  }

  onCheck(){
    this.changeDetectorRef.detectChanges();
  }

  selectedFile: any;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


}
