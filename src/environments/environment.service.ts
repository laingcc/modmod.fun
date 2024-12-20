import {Injectable} from "@angular/core";
import {environment} from "./environment";

@Injectable()
export class EnvironmentService {

  get apiHost(){
    return environment.host;
  }
}
