import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import { Thread } from '../../services/thread.service';
import {FormsModule} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CommonModule, NgIf} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";
import { generateRandomString } from '../../utils/utils';

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

  selectedFiles: { file: File; preview: string }[] = [];
  fileInputElement: HTMLInputElement | null = null;

  constructor(
    private dialogRef: MatDialogRef<CreateThreadModalComponent, CreateThreadReturn>,
    @Inject(MAT_DIALOG_DATA) public data: { thread?: Thread }, // Accept thread data for editing
    public changeDetectorRef: ChangeDetectorRef
  ) {
    if (data?.thread) {
      this.thread = { ...data.thread }; // Populate thread details if provided
    }
  }

  onSubmit() {
    // If the author (tripcode) is not provided, generate a random string
    if (!this.thread.author || this.thread.author.trim() === '') {
      this.thread.author = generateRandomString(12); // Use the imported function
    }
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileInputElement = input;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);

    if (this.fileInputElement) {
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => dataTransfer.items.add(file.file));
      this.fileInputElement.files = dataTransfer.files;
    }
  }
}

