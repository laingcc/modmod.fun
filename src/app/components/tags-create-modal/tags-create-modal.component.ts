import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tags-create-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tags-create-modal.component.html',
  styleUrls: ['./tags-create-modal.component.scss']
})
export class TagsCreateModalComponent {
  public form: FormGroup;
  public loading = false;
  public error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<TagsCreateModalComponent>,
    private builder: FormBuilder,
    private tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: { threadId:number },
  ) {
    this.form = this.builder.group({
      name: ['', Validators.required],
    });
  }

  createTag() {
    this.error = null;
    if (this.form.invalid) return;

    const formValue = this.form.value;
    if (!formValue.name) {
      this.error = "Tag Name is Required";
      return;
    }

    this.loading = true;
    this.tagService.createTag({ name: formValue.name, threadIds:[this.data.threadId] }).subscribe({
      next: tag => {
        this.loading = false;
        this.dialogRef.close(tag);
      },
      error: err => {
        this.loading = false;
        this.error = "Failed to create tag.";
      }
    });
  }
}
