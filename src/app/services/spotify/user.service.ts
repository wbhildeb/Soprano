import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private userID: string;

    constructor() { }

    public LogOut() : void
    {
        throw "UserService:LogOut() not implemented";
        // HTTP request: Get /spotify/logout
        this.userID = undefined;
    }

    public LogIn() : void
    {
        throw "UserService:LogIn() not implemented";
        // HTTP request: Get /spotify/login
        this.GetUserID();
    }

    public GetUser() : User
    {
        throw "UserService:GetUser() not implemented";

    }

    public GetUserID() : string {
        throw "UserService:GetUserID() not implemented";

        if (this.userID === undefined)
        {
            // make http request
        }
        else
        {
            return this.userID;
        }
    }
}

export class User
{

}
