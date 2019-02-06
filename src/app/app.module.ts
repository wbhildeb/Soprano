import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { PaperShowcaseComponent } from './components/paper-showcase/paper-showcase.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SpotifyComponent,
    PaperShowcaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
