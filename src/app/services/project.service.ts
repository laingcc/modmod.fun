import {Observable} from "rxjs";
import {LoremIpsum} from "lorem-ipsum";

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {EnvironmentService} from "../../environments/environment.service";

export type Project = {
  id: number;
  title: string;
  description: string;
  author: string;
  imageId: string;
}

@Injectable()
export class ProjectService {
  // getAllProjects(): Project[]{
  //   return [...Array(Math.floor(Math.random()*20))].map(v => this.getMockProject())
  //
  // }
  //
  //
  // getMockProject(): Project {
  //   const lorem = new LoremIpsum(
  //     {
  //       sentencesPerParagraph: {
  //         max: 8,
  //         min: 4
  //       },
  //       wordsPerSentence:{
  //         max:16,
  //         min:1
  //       }
  //     }
  //   )
  //
  //   return {
  //     id: Math.floor(Math.random()*9999),
  //     name: lorem.generateWords(Math.floor(Math.random()*10)),
  //     description: lorem.generateParagraphs(25),
  //     author: lorem.generateWords(2).split(' ').join(''),
  //
  //   }
  //

  // }
getAllProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.envService.apiHost}/threads`);
}
constructor(private http: HttpClient, private envService: EnvironmentService) {}

}
