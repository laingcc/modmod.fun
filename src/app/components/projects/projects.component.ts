import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from "../../services/project.service";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateThreadModalComponent} from "../create-thread-modal/create-thread-modal.component";
import {Observable, take, takeUntil} from "rxjs";
import {HeadsUpBannerComponent} from "../heads-up-banner/heads-up-banner.component";
import {ThreadService} from "../../services/thread.service";
import {Destroyable} from "../base/destroyable/destroyable.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgForOf,
    RouterModule,
    AsyncPipe,
    SlicePipe,
    HeadsUpBannerComponent,
  ],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent extends Destroyable implements OnInit {

  projects$: Observable<Project[]>;
  constructor(
    private projectService: ProjectService,
    private router: Router,
    private matDialog: MatDialog,
    private threadService: ThreadService
  ) {
    super();
  }

  ngOnInit() {
    this.projects$ = this.projectService.getAllProjects()
  }

  navigate(id:number){
    this.router.navigate(['project',{id:id}])
  }


  addProject() {
    this.matDialog.open(CreateThreadModalComponent).afterClosed().subscribe((newThread) => {
      console.log(newThread)
      if (newThread){
        this.threadService.createThread(newThread).subscribe(response => {
          console.log('lmao')
        });
      }
      //wait a bit, and then maybe route to the new project?

    });
  }
}
