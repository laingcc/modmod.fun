import { Component } from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { generateRandomString } from '../../utils/utils'; // Import the function
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reply-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxCaptchaModule
  ],
  templateUrl: './reply-modal.component.html',
  styleUrl: './reply-modal.component.scss'
})
export class ReplyModalComponent {
  public form: FormGroup;
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  hcaptcha_token: string | null = null;
  hcaptcha_site_key = environment.hcaptcha_site_key;

  public constructor(
    private dialogRef: MatDialogRef<ReplyModalComponent>,
    private builder: FormBuilder
  ) {
    this.form = this.builder.group({
      content: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  onCaptchaSuccess(token: string) {
    this.hcaptcha_token = token;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imageFiles = Array.from(input.files);
      this.imagePreviews = [];
      for (const file of this.imageFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  sendComment() {
    const formValue = this.form.value;
    // If the author field is empty, generate a random string
    if (!formValue.author || formValue.author.trim() === '') {
      formValue.author = generateRandomString(12);
    }
    this.dialogRef.close({
      content: formValue.content,
      author: formValue.author,
      files: this.imageFiles,
      hcaptcha_token: this.hcaptcha_token
    });
  }
}
