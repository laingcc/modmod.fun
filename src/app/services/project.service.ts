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
  imageIds: string[];
}

@Injectable()
export class ProjectService {
getAllProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.envService.apiHost}/threads`);
}
constructor(private http: HttpClient, private envService: EnvironmentService) {}

}
