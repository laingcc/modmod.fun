import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LoremIpsum} from "lorem-ipsum";

export type Project = {
  id: number;
  name: string;
  description: string;
  author: string;
}

@Injectable()
export class ProjectService {
  constructor() {

  }

  getAllProjects(): Project[]{
    return [...Array(Math.floor(Math.random()*20))].map(v => this.getMockProject())

  }


  getMockProject(): Project {
    const lorem = new LoremIpsum(
      {
        sentencesPerParagraph: {
          max: 8,
          min: 4
        },
        wordsPerSentence:{
          max:16,
          min:1
        }
      }
    )

    return {
      id: Math.floor(Math.random()*9999),
      name: lorem.generateWords(Math.floor(Math.random()*10)),
      description: lorem.generateParagraphs(25),
      author: lorem.generateWords(2).split(' ').join(''),

    }


  }


}
