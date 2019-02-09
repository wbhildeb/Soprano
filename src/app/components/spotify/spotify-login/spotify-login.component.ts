import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify-login',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})
export class SpotifyLoginComponent implements OnInit
{
    private loggedIn : boolean = false;
    


    constructor() { }

    ngOnInit() {
    }

    isLoggedIn() : boolean
    {
        return this.loggedIn;
    }

    onLogin()
    {
        this.loggedIn = true;
    }

    onLogout()
    {
        this.loggedIn = false;
    }

}
