import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from "../../services/project.service";
import {NgForOf} from "@angular/common";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgForOf,
    RouterModule
  ],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projects: Project[];
  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.projects = this.projectService.getAllProjects()
  }

  navigate(id:number){
    this.router.navigate(['project',{id:id}])
  }


}
