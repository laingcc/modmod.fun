import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from "../../services/project.service";
import {AsyncPipe, CommonModule, NgForOf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateThreadModalComponent, CreateThreadReturn} from "../create-thread-modal/create-thread-modal.component";
import {Observable, map, switchMap, takeUntil} from "rxjs";
import {HeadsUpBannerComponent} from "../heads-up-banner/heads-up-banner.component";
import {ThreadService} from "../../services/thread.service";
import {Destroyable} from "../base/destroyable/destroyable.component";
import {TripcodePillComponent} from "../tripcode-pill/tripcode-pill.component";
import {ImageService} from "../../services/image.service";
import {EnvironmentService} from "../../../environments/environment.service";
import {Title} from "@angular/platform-browser";
import {TagService} from "../../services/tag.service";
import {TagsMiniComponent} from "../tags-mini/tags-mini.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgForOf,
    RouterModule,
    AsyncPipe,
    HeadsUpBannerComponent,
    TripcodePillComponent,
    NgOptimizedImage,
    TagsMiniComponent,
    CommonModule
  ],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent extends Destroyable implements OnInit {

  projects$: Observable<Project[]>;
  activeTagFilter$: Observable<string | null>;
  imagehost = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private threadService: ThreadService,
    private imageService: ImageService,
    private environmentService: EnvironmentService,
    private titleService: Title,
    private tagService: TagService
  ) {
    super();
  }

  ngOnInit() {
    this.imagehost = `${this.environmentService.apiHost}/images/`;
    this.titleService.setTitle('modmod[.fun]');

    this.activeTagFilter$ = this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$),
      map(params => params['tag'] || null)
    );

    this.projects$ = this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(params => {
        const tagFilter = params['tag'];
        if (tagFilter) {
          return this.projectService.getAllProjects().pipe(
            switchMap(projects => {
              const projectPromises = projects.map(project => {
                return new Promise<Project | null>(resolve => {
                  this.tagService.getThreadTags(project.id).subscribe({
                    next: tags => {
                      if (tags.some(tag => tag.name === tagFilter)) {
                        resolve(project);
                      } else {
                        resolve(null);
                      }
                    },
                    error: () => resolve(null)
                  });
                });
              });

              return new Observable<Project[]>(observer => {
                Promise.all(projectPromises).then(filteredProjects => {
                  observer.next(filteredProjects.filter(project => project !== null) as Project[]);
                  observer.complete();
                });
              });
            })
          );
        } else {
          // If no tag filter, get all projects
          return this.projectService.getAllProjects();
        }
      })
    );
  }

  clearTagFilter(): void {
    this.router.navigate([''], { queryParams: {} });
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
