import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { PaperShowcaseComponent } from './components/paper-showcase/paper-showcase.component';
import { ArtistListComponent } from './components/spotify/artist/artist-list/artist-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SpotifyComponent,
    PaperShowcaseComponent,
    ArtistListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
