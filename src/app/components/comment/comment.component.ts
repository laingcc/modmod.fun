import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActionsComponent} from "../actions/actions.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {MarkdownComponent} from "ngx-markdown";
import {EnvironmentService} from "../../../environments/environment.service";


export type ThreadComment = {
  author: string,
  content: string,
  date: Date,
  id: number,
  feverCount: number,
  parentId?: number,
  images?: string[], // Array of image URLs for gallery
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    ActionsComponent,
    NgIf,
    TripcodePillComponent,
    MarkdownComponent,
    DatePipe,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() Comment: ThreadComment = {
    author: '',
    content: '',
    date: new Date(),
    id: 0,
    feverCount: 0,
    images:[]
  };

  @Input() isOp: boolean = false;

  @Input() quoteNumber?: number;

  @Output() parentComment = new EventEmitter<ThreadComment>();

  currentImageIndex: number = 0;
  isImageModalOpen: boolean = false;

  constructor(
    private environmentService: EnvironmentService
  ) {}
  onComment(comment: ThreadComment) {
    comment.parentId = this.Comment.id;
    this.parentComment.next(comment);
  }

  scrollToComment(commentId: number): void {
    const element = document.getElementById(`comment-${commentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  imageUrl(id:string | null, fullres=false){
    return `${this.environmentService.apiHost}/images/${id}`+ (fullres ? '?full_res=true' : '');
  }

  nextImage(): void {
    if (this.Comment.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.Comment.images.length;
    }
  }

  prevImage(): void {
    if (this.Comment.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.Comment.images.length) % this.Comment.images.length;
    }
  }

  toggleImageModal(): void {
    this.isImageModalOpen = !this.isImageModalOpen;
  }
}
