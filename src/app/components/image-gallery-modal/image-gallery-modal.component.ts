import { Component, Inject } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrls: ['./image-gallery-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class ImageGalleryModalComponent {
  imageIds: number[] = [];
  show: boolean = true;
  currentIndex = 0;
  imageUrls: string[] = [];
  loading: boolean = false;

  constructor(
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data: { imageIds: number[] },
    private dialogRef: MatDialogRef<ImageGalleryModalComponent>
  ) {
    this.imageIds = data.imageIds || [];
    this.loadImages();
  }

  loadImages() {
    this.imageUrls = this.imageIds.map(id =>
      `${this.imageService['environmentService'].apiHost}/images/${id}?full_res=true`
    );
    this.currentIndex = 0;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex < this.imageUrls.length - 1) {
      this.currentIndex++;
    }
  }

  selectImage(idx: number) {
    this.currentIndex = idx;
  }

  close() {
    this.dialogRef.close();
  }
}
