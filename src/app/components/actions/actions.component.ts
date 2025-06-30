import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ReplyModalComponent} from "../reply-modal/reply-modal.component";
import {ThreadComment} from "../comment/comment.component";
import {ImageService} from '../../services/image.service';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [

  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  @Output() Comment = new EventEmitter<ThreadComment>()
  constructor(
    private dialog: MatDialog,
    private imageService: ImageService,
  ) {
  }
  async reply() {
    this.dialog.open(ReplyModalComponent).afterClosed().subscribe(async (result: any) => {

      if (result && (result.content || result.author)) {
        let imageUrls: string[] = [];
        if (result.files && result.files.length) {
          try {
            const images = await this.imageService.createImages(result.files).toPromise();
            imageUrls = images?.map(image => image.filename) ?? [];
          } catch (e) {
            alert('Image upload failed.');
            return;
          }
        }
        const comment: ThreadComment = {
          author: result.author,
          content: result.content,
          date: new Date(),
          id: 0, // Will be set by backend
          feverCount: 0,
          images: imageUrls
        };
        this.Comment.emit(comment);
      }
    });
  }
}
