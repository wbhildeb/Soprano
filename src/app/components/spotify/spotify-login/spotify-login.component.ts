import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../spotify.models';
import { UsersService } from '../services/users.service';
import { userInfo } from 'os';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-spotify-login',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})
export class SpotifyLoginComponent implements OnInit, OnDestroy
{
    user: User;
    userSub: Subscription;

    constructor(private usersService: UsersService, private http: HttpClient) { }

    ngOnInit()
    {
        this.usersService.getUser();

        this.userSub = this.usersService.getUserUpdateListener()
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    ngOnDestroy()
    {
        this.userSub.unsubscribe();
    }

    isLoggedIn()
    {
        return this.user;
    }

    onLogin()
    {
        // this.http.get('http://localhost:3000/spotify/login', { withCredentials: true });
        this.usersService.getUser();
    }


    onGetTracks()
    {
        console.log("onGetTracks triggered");
        this.usersService.getTracks();
    }
}
