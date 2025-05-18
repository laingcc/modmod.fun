import {ThreadComment} from "../components/comment/comment.component";
import {LoremIpsum} from "lorem-ipsum";
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
  imageId: string;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ThreadService {
  // getThread(): Thread{
  //   return this.getMockThread()
  // }

  // private getMockThread() : Thread{
  //   const lorem = new LoremIpsum({
  //     sentencesPerParagraph: {
  //       max: 8,
  //       min: 4
  //     },
  //     wordsPerSentence:{
  //       max:16,
  //       min: 4
  //     }
  //   });
  //
  //   return {
  //     description: lorem.generateParagraphs(25),
  //     comments:[...Array(Math.floor(Math.random()*100))].map(() => {
  //       return {
  //         author: lorem.generateWords(2).split(' ').join(''),
  //         content: lorem.generateParagraphs(1),
  //         date: new Date(),
  //         id: Math.floor(Math.random()*999999),
  //         feverCount: Math.floor(Math.random()*100)
  //       }
  //     })
  //
  //   }
  //
  // }

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
