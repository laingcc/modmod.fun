import { Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ProjectsComponent } from "./components/projects/projects.component";
import { TripcodeFaqComponent } from "./static-pages/tripcode-faq/tripcode-faq.component";
import { CommunityComponent } from "./components/community/community.component"; // Import the new component

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
    path: 'tripcodes',
    component: TripcodeFaqComponent
  },
  {
    path: 'community',
    component: CommunityComponent // Add the new route
  }
];
