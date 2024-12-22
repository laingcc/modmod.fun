import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {TripcodeFaqComponent} from "./static-pages/tripcode-faq/tripcode-faq.component";

export const routes: Routes = [
  {
    path: 'project',
    component: DashboardComponent
  },
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path:'tripcodes',
    component: TripcodeFaqComponent
  }
];
