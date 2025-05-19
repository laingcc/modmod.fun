import {ChangeDetectorRef, Component} from '@angular/core';
import { ThreadService, Thread } from '../../services/thread.service';
import {FormsModule, NgForm} from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";
import {BrowserModule} from "@angular/platform-browser";

export interface CreateThreadReturn {
  thread: Thread;
  images: File[];
}
@Component({
  selector: 'app-create-thread-modal',
  templateUrl: './create-thread-modal.component.html',
  styleUrls: ['./create-thread-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MarkdownComponent,
    NgIf,
    CommonModule
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
    imageIds: []
  };


  constructor(
    private threadService: ThreadService,
    private dialogRef: MatDialogRef<CreateThreadModalComponent, CreateThreadReturn>,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.dialogRef.close({ thread: this.thread, images: this.selectedFiles.map(f => f.file) });
  }

  onPost(form:any){
    if (form.checkValidity()){
      this.onSubmit();
    }
  }

  onCheck(){
    this.changeDetectorRef.detectChanges();
  }

  selectedFiles: { file: File; preview: string }[] = [];

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
    }
  }
}

