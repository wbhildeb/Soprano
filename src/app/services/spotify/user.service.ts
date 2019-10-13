import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private userID: string;

  constructor() { }

  public LogOut(): void
  {
    throw new Error('UserService:LogOut() not implemented');
        // HTTP request: Get /spotify/logout
    this.userID = undefined;
  }

  public LogIn(): void
  {
    throw new Error('UserService:LogIn() not implemented');
        // HTTP request: GET /spotify/login
    this.GetUserID();
  }

  public GetUser(): User
  {
    throw new Error('UserService:GetUser() not implemented');

  }

  public GetUserID(): string
  {
    throw new Error('UserService:GetUserID() not implemented');

    if (this.userID === undefined)
    {
            // make http request to server
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
