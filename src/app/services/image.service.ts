import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

export type Image = {
  filename: string;
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  getImage(imageId: number): Observable<Blob> {
    return this.http.get(
      `${this.environmentService.apiHost}/images/${imageId}?full_res=true`,
      { responseType: 'blob' }
    );
  }

  createImage(imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<Image>(`${this.environmentService.apiHost}/images`, formData);
  }

  createImages(imageFiles: File[]): Observable<Image[]> {
    const formData = new FormData();
    imageFiles.forEach((file, index) => {
      formData.append('files', file, `file${index}`);
    });

    return this.http.post<Image[]>(`${this.environmentService.apiHost}/images/batch`, formData);
  }
}
