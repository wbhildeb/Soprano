import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubPlaylistsComponent } from './components/soprano/sub-playlists/sub-playlists.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent },
    { path: 'sub-playlists', component: SubPlaylistsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
