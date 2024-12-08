import {Component, OnInit} from '@angular/core';
import {LoremIpsum} from "lorem-ipsum";
import {Thread, ThreadService} from "../../services/thread.service";
import {CommentComponent} from "../comment/comment.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommentComponent,
    NgForOf
  ],
  providers:[ThreadService],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnInit {

  protected threadData: Thread | undefined

  constructor(
    private threadService: ThreadService
  ) {
  }

  ngOnInit() {
    this.threadData = this.threadService.getThread()
  }


}
