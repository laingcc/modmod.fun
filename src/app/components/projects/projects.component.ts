import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from "../../services/project.service";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateThreadModalComponent} from "../create-thread-modal/create-thread-modal.component";
import {Observable} from "rxjs";
import {HeadsUpBannerComponent} from "../heads-up-banner/heads-up-banner.component";

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
export class ProjectsComponent implements OnInit {

  projects$: Observable<Project[]>;
  constructor(
    private projectService: ProjectService,
    private router: Router,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.projects$ = this.projectService.getAllProjects()
  }

  navigate(id:number){
    this.router.navigate(['project',{id:id}])
  }


  addProject() {
    this.matDialog.open(CreateThreadModalComponent);
  }
}
