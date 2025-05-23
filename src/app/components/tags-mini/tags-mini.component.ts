import { Component, Input, OnInit } from '@angular/core';
import { TagService, ThreadTag } from '../../services/tag.service';
import {CommonModule, NgForOf} from "@angular/common";
import {Observable} from "rxjs";

@Component({
    selector: 'app-tags-mini',
    templateUrl: './tags-mini.component.html',
    standalone: true,
    styleUrls: ['./tags-mini.component.scss'],
    imports: [
      CommonModule,
      NgForOf,
    ]
})
export class TagsMiniComponent implements OnInit {
  @Input() threadId!: number;
  @Input() refresh$: Observable<void>;
  @Input() maxTags: number;

  tags: ThreadTag[] = [];
  loading = false;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    if (this.threadId != null) {
      this.updateTags();
    }
    if (this.refresh$) {
      this.refresh$.subscribe(() => {
        this.updateTags();
      });
    }
  }

  updateTags(){
    this.loading = true;
    this.tagService.getThreadTags(this.threadId).subscribe({
      next: tags => {
        this.tags = tags.slice(0, this.maxTags?? -1);
        this.loading = false;
      },
      error: () => {
        this.tags = [];
        this.loading = false;
      }
    });
  }
}
