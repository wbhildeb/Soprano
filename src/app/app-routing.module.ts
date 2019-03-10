import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaperShowcaseComponent } from './components/paper-showcase/paper-showcase.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects/projects.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'paper', component: PaperShowcaseComponent},
  { path: 'spotify', component: SpotifyComponent},
  { path: 'projects', component: ProjectsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
