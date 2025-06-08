import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, from, Observable, switchMap} from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

export type Image = {
  filename: string;
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {
  }

  getImage(imageId: number): Observable<Blob> {
    return this.http.get(
      `${this.environmentService.apiHost}/images/${imageId}?full_res=true`,
      {responseType: 'blob'}
    );
  }

  createImage(imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<Image>(`${this.environmentService.apiHost}/images`, formData);
  }

// Helper function to convert File to WebP Blob
  private fileToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('WebP conversion failed'));
          },
          'image/webp',
          0.92 // quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  createImages(imageFiles: File[]): Observable<Image[]> {
    const webpBlobs$ = imageFiles.map(file => from(this.fileToWebP(file)));
    return forkJoin(webpBlobs$).pipe(
      switchMap((webpBlobs: Blob[]) => {
        const formData = new FormData();
        webpBlobs.forEach((blob, i) => {
          formData.append('files', blob, `file${i}.webp`);
        });
        return this.http.post<Image[]>(`${this.environmentService.apiHost}/images/batch`, formData);
      })
    );
  }
}
