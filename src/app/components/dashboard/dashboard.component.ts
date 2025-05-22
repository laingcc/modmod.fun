import {Component, OnInit} from '@angular/core';
import {ThreadComponent} from "../thread/thread.component";
import {Thread, ThreadService} from "../../services/thread.service";
import {ReplaySubject, take, takeUntil} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ThreadComment} from "../comment/comment.component";
import {Title} from "@angular/platform-browser";
import {Destroyable} from "../base/destroyable/destroyable.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {EnvironmentService} from "../../../environments/environment.service";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateThreadModalComponent} from "../create-thread-modal/create-thread-modal.component";
import { ImageGalleryModalComponent } from "../image-gallery-modal/image-gallery-modal.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ThreadComponent,
    AsyncPipe,
    NgIf,
    TripcodePillComponent,
    NgOptimizedImage,
    MatDialogModule,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends Destroyable implements OnInit {

  threadData = new ReplaySubject<Thread>(1)
  id: number;
  imageUrl = '';
  selectedImageIdx = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private threadService: ThreadService,
    private titleService: Title,
    protected environmentService: EnvironmentService,
    private dialog: MatDialog // Inject MatDialog
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
        this.titleService.setTitle((thread.title ?? 'Thread' )+ ' | modmod[.fun]')
        this.selectedImageIdx = 0;
        const mainImageId = thread.imageIds[0]
        this.imageUrl = `${this.environmentService.apiHost}/images/${mainImageId}`
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

  edit() {
    this.threadData.pipe(take(1)).subscribe(thread => {
      const dialogRef = this.dialog.open(CreateThreadModalComponent, {
        width: '500px',
        data: { thread: {
            ...thread,
            author: '',
          }}
      });

      dialogRef.afterClosed().subscribe(updatedThread => {
        if (updatedThread) {
          this.threadService.updateThread(this.id, updatedThread).subscribe(() => {
            this.threadService.getThread(this.id).pipe(take(1)).subscribe(thread => {
              this.threadData.next(thread);
            });
          });
        }
      });
    });
  }

  launchGallery() {
    this.threadData.pipe(take(1)).subscribe(thread => {
      this.dialog.open(ImageGalleryModalComponent, {
        width: '80vw',
        maxWidth: '80vw',
        data: {
          imageIds: thread.imageIds,
          initialIndex: this.selectedImageIdx
        }
      });
    });
  }

  selectImage(idx: number, thread: Thread) {
    this.selectedImageIdx = idx;
    const imageId = thread.imageIds[idx];
    this.imageUrl = `${this.environmentService.apiHost}/images/${imageId}`;
  }

}
