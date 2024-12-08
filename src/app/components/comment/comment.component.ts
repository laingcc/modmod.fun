import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {ActionsComponent} from "../actions/actions.component";


export type ThreadComment = {
  author: string,
  content: string,
  date: Date,
  id: number
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    JsonPipe,
    ActionsComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() Comment: ThreadComment | undefined

}
