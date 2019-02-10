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
                    id:         userData.user.userID,
                    name:       userData.user.name,
                    imageURL:   userData.user.imageURL
                };
                this.userUpdated.next(this.user);
            });
    }

    getUserUpdateListener() : Observable<User>
    {
        return this.userUpdated.asObservable();
    }
}
