import {Component, Input} from '@angular/core';
import {JsonPipe, NgIf, SlicePipe} from "@angular/common";
import {ActionsComponent} from "../actions/actions.component";


export type ThreadComment = {
  author: string,
  content: string,
  date: Date,
  id: number
  feverCount: number
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    ActionsComponent,
    NgIf,
    SlicePipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() Comment: ThreadComment = {
    author: '',
    content: '',
    date: new Date(),
    id: 0,
    feverCount: 0
  }

  @Input() isOp: boolean = false;

  getColorForAuthor(authorHash: string){
    let color = ''
    for(let i = 0; color.length < 6; i++){
      color = color.concat(authorHash.charCodeAt(i).toString(16))
    }
    return `#${color}`

}

}
