import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubPlaylistsComponent } from './components/spotify/sub-playlists/sub-playlists.component';
import { TestTreeComponent } from './components/test/test-tree/test-tree.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent },
    { path: 'sub-playlists', component: SubPlaylistsComponent },
    { path: 'test/tree', component: TestTreeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
