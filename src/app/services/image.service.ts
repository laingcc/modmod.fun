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

  getImage(imageId: number): Observable<Image> {
    return this.http.get<Image>(`${this.environmentService.apiHost}/images/${imageId}`);
  }

  createImage(imageFile: File){
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<Image>(`${this.environmentService.apiHost}/images`, formData);
  }
}
