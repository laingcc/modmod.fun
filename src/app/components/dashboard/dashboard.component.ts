import {Component, OnInit} from '@angular/core';
import {ThreadComponent} from "../thread/thread.component";
import {Thread, ThreadService} from "../../services/thread.service";
import {ReplaySubject, take, takeUntil} from "rxjs";
import {AsyncPipe, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ThreadComment} from "../comment/comment.component";
import {Title} from "@angular/platform-browser";
import {Destroyable} from "../base/destroyable/destroyable.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {EnvironmentService} from "../../../environments/environment.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ThreadComponent,
    AsyncPipe,
    SlicePipe,
    NgIf,
    TripcodePillComponent,
    NgOptimizedImage
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends Destroyable implements OnInit {

  threadData = new ReplaySubject<Thread>(1)
  id: number;
  imageUrl = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private threadService: ThreadService,
    private titleService: Title,
    private environmentService: EnvironmentService
  ) {
    super()
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = +(params.get('id') ?? -1);
      this.threadService.getThread(this.id).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(thread => {
        this.threadData.next(thread)
        this.titleService.setTitle(thread.title ?? 'Thread')
        this.imageUrl = `${this.environmentService.apiHost}/images/${thread.imageId}`
        console.log(thread)
      });
    })
  }

  onComment(comment: ThreadComment){
    this.threadService.addComment(this.id, comment).subscribe(response => {
      console.log('Comment added:', response);
      this.threadService.getThread(this.id).pipe(
        take(1)
      ).subscribe(thread => {
        this.threadData.next(thread)
      })
    });
  }


}
