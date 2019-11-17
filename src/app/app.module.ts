import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubPlaylistsComponent } from './components/spotify/sub-playlists/sub-playlists.component';
import { SpotifyTopBarComponent } from './components/spotify/spotify-top-bar/spotify-top-bar.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import * as environment from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { TestTreeComponent } from './components/test/test-tree/test-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SubPlaylistsComponent,
    SpotifyTopBarComponent,
    TestTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'spotify'),
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
