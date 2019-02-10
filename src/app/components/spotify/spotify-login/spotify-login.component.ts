import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../spotify.models';
import { UsersService } from '../services/users.service';
import { userInfo } from 'os';

@Component({
  selector: 'app-spotify-login',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})
export class SpotifyLoginComponent implements OnInit, OnDestroy
{
    user: User;
    userSub: Subscription;

    constructor(private usersService: UsersService) { }

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
        this.user
    }

    isLoggedIn()
    {
        return this.user;
    }

}
