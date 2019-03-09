import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaperShowcaseComponent } from './components/paper-showcase/paper-showcase.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './components/projects/project/project.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'paper', component: PaperShowcaseComponent},
  { path: 'spotify', component: SpotifyComponent},
  { path: 'projects', component: ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
