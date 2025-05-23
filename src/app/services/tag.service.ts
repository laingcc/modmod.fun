import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EnvironmentService } from "../../environments/environment.service";
import { Observable } from "rxjs";

export type Tag = {
  id: number;
  name: string;
  threadIds: number[];
};

export type ThreadTag = {
  id: number;
  name: string;
};

@Injectable({
  providedIn: "root"
})
export class TagService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.environmentService.apiHost}/tags`);
  }

  getTag(tagId: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.environmentService.apiHost}/tags/${tagId}`);
  }

  createTag(tag: { name: string; threadIds: number[] }): Observable<Tag> {
    return this.http.post<Tag>(`${this.environmentService.apiHost}/tags`, tag);
  }

  updateTag(tagId: number, tag: { name: string; threadIds: number[] }): Observable<Tag> {
    return this.http.put<Tag>(`${this.environmentService.apiHost}/tags/${tagId}`, tag);
  }

  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.environmentService.apiHost}/tags/${tagId}`);
  }

  getThreadTags(threadId: number): Observable<ThreadTag[]> {
    return this.http.get<ThreadTag[]>(`${this.environmentService.apiHost}/threads/${threadId}/tags`);
  }

  addTagToThread(threadId: number, name: string): Observable<ThreadTag> {
    return this.http.post<ThreadTag>(`${this.environmentService.apiHost}/threads/${threadId}/tags`, { name });
  }

  removeTagFromThread(threadId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.environmentService.apiHost}/threads/${threadId}/tags/${tagId}`);
  }
}
