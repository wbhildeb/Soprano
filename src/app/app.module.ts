import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubPlaylistsComponent } from './components/spotify/sub-playlists/sub-playlists.component';
import { SpotifyTopBarComponent } from './components/spotify/spotify-top-bar/spotify-top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SubPlaylistsComponent,
    SpotifyTopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
