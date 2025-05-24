import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagService, Tag } from '../../services/tag.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags-create-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgFor,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './tags-create-modal.component.html',
  styleUrls: ['./tags-create-modal.component.scss']
})
export class TagsCreateModalComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public error: string | null = null;
  public allTags: Tag[] = [];
  public filteredOptions: Observable<string[]>;

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

  ngOnInit() {
    this.tagService.getTags().subscribe(tags => {
      this.allTags = tags;
    });

    this.filteredOptions = this.form.get('name')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags
      .map(tag => tag.name)
      .filter(name => name.toLowerCase().includes(filterValue));
  }

  createTag() {
    this.error = null;
    if (this.form.invalid) return;

    const formValue = this.form.value;
    if (!formValue.name) {
      this.error = "Tag Name is Required";
      return;
    }

    const tagName = formValue.name.toLowerCase();

    this.loading = true;
    this.tagService.createTag({ name: tagName, threadIds:[this.data.threadId] }).subscribe({
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
