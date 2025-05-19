import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from "../../services/project.service";
import {AsyncPipe, NgForOf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateThreadModalComponent, CreateThreadReturn} from "../create-thread-modal/create-thread-modal.component";
import {Observable, switchMap, take, takeUntil} from "rxjs";
import {HeadsUpBannerComponent} from "../heads-up-banner/heads-up-banner.component";
import {ThreadService} from "../../services/thread.service";
import {Destroyable} from "../base/destroyable/destroyable.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {ImageService} from "../../services/image.service";
import {EnvironmentService} from "../../../environments/environment.service";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgForOf,
    RouterModule,
    AsyncPipe,
    SlicePipe,
    HeadsUpBannerComponent,
    TripcodePillComponent,
    NgOptimizedImage,
  ],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent extends Destroyable implements OnInit {

  projects$: Observable<Project[]>;
  imagehost = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private matDialog: MatDialog,
    private threadService: ThreadService,
    private imageService: ImageService,
    private environmentService: EnvironmentService
  ) {
    super();
  }

  ngOnInit() {
    this.projects$ = this.projectService.getAllProjects()
    this.imagehost = `${this.environmentService.apiHost}/images/`;
  }

  navigate(id: number) {
    this.router.navigate(['project', {id: id}])
  }


  addProject() {
    this.matDialog.open(CreateThreadModalComponent).afterClosed().subscribe((newThread: CreateThreadReturn) => {
      console.log(newThread)
      if (newThread){
          this.imageService.createImages(newThread.images).pipe(switchMap(response => {
            newThread.thread.imageIds = response.map(image => image.filename);
            return this.threadService.createThread(newThread.thread)

          })).subscribe(response => {
          this.router.navigate(['project',{id:response.id}])
        });
      }
    });
  }
}
