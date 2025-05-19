import {ThreadComment} from "../components/comment/comment.component";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EnvironmentService} from "../../environments/environment.service";


export type Thread = {
  description: string;
  comments: ThreadComment[]
  id: number;
  title: string;
  author: string;
  date: string;
  imageIds: string[];
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ThreadService {

  constructor(private http: HttpClient,
              private environmentService: EnvironmentService) {}

  getThread(threadId: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.environmentService.apiHost}/threads/${threadId}`);
  }

  createThread(thread: Thread): Observable<Thread> {
    return this.http.post<Thread>(`${this.environmentService.apiHost}/threads`, thread);
  }

  updateThread(threadId: number, thread: Thread): Observable<Thread> {
    return this.http.put<Thread>(`${this.environmentService.apiHost}/threads/${threadId}`, thread);
  }
  addComment(threadId: number, comment: ThreadComment): Observable<ThreadComment> {
  return this.http.post<ThreadComment>(`${this.environmentService.apiHost}/threads/${threadId}/comments`, comment);
}
}
