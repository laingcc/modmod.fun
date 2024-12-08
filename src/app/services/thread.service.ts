import {ThreadComment} from "../components/comment/comment.component";
import {LoremIpsum} from "lorem-ipsum";
import {Injectable} from "@angular/core";


export type Thread = {
  description: string;
  comments: ThreadComment[]

}

@Injectable()
export class ThreadService {
  getThread(): Thread{
    return this.getMockThread()
  }

  private getMockThread() : Thread{
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence:{
        max:16,
        min: 4
      }
    });

    return {
      description: lorem.generateParagraphs(25),
      comments:[...Array(Math.floor(Math.random()*100))].map(() => {
        return {
          author: lorem.generateWords(2).split(' ').join(''),
          content: lorem.generateParagraphs(1),
          date: new Date(),
          id: Math.floor(Math.random()*999999),
        }
      })

    }

  }
}
