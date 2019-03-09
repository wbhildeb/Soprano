import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { PaperShowcaseComponent } from './components/paper-showcase/paper-showcase.component';
import { ArtistListComponent } from './components/spotify/artist/artist-list/artist-list.component';
import { ArtistCreateComponent } from './components/spotify/artist/artist-create/artist-create.component';
import { TrackListComponent } from './components/spotify/track/track-list/track-list.component';
import { SpotifyLoginComponent } from './components/spotify/spotify-login/spotify-login.component';
import { ProjectComponent } from './components/projects/project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SpotifyComponent,
    PaperShowcaseComponent,
    ArtistListComponent,
    ArtistCreateComponent,
    TrackListComponent,
    SpotifyLoginComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
