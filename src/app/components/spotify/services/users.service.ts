import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { User } from '../spotify.models';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { stringify } from 'querystring';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private user: User;
    private userUpdated = new Subject<User>();

    constructor(private http: HttpClient) { }

    getUser()
    {
        this.http
            .get<{message: string, user: any}>(
                'http://localhost:3000/spotify/user',
                { withCredentials: true }
            )
            .subscribe((userData) =>
            {
                this.user = {
                    id:         userData.user.id,
                    name:       userData.user.display_name,
                    imageURL:   userData.user.image_url
                };
                this.userUpdated.next(this.user);
            });
    }

    getUserUpdateListener() : Observable<User>
    {
        return this.userUpdated.asObservable();
    }

    getTracks()
    {
        console.log("users.service.getTracks() called");
        this.http.get<{message: string, user: any}>(
            'http://localhost:3000/spotify/tracks',
            { withCredentials: true }
        )
        .subscribe(() => 
        {
            console.log("GET request complete");
        });
    }
}
