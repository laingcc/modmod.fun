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

  selectedFiles: { file: File; preview: string }[] = [];
  fileInputElement: HTMLInputElement | null = null;

  constructor(
    private threadService: ThreadService,
    private dialogRef: MatDialogRef<CreateThreadModalComponent, CreateThreadReturn>,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const crypto = window.crypto || (window as any).msCrypto; // For older browsers
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    randomValues.forEach(value => {
      result += characters.charAt(value % characters.length);
    });
    return result;
  }

  onSubmit() {
    // If the author (tripcode) is not provided, generate a random string
    if (!this.thread.author || this.thread.author.trim() === '') {
      this.thread.author = this.generateRandomString(12); // Generate a 12-character random string
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
    this.fileInputElement = input; // Store the file input element for later use
    if (input.files) {
      this.selectedFiles = Array.from(input.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
    }
  }

  removeImage(index: number): void {
    // Remove the selected image
    this.selectedFiles.splice(index, 1);

    // Update the file input element to reflect the remaining files
    if (this.fileInputElement) {
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => dataTransfer.items.add(file.file));
      this.fileInputElement.files = dataTransfer.files;
    }
  }
}
