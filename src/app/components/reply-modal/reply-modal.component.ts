import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-reply-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reply-modal.component.html',
  styleUrl: './reply-modal.component.scss'
})
export class ReplyModalComponent {

  public form: FormGroup;
  public constructor(
    private dialogRef: MatDialogRef<ReplyModalComponent>,
    private builder: FormBuilder
  ) {
    this.form = this.builder.group({
      content: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  sendComment() {
    const formValue = this.form.value;
    console.log(formValue)
    this.dialogRef.close({
      content: formValue.content,
      author: formValue.author,
      date: new Date(),
    });
  }
}
