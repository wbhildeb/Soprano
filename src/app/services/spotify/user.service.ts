import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private userID: string;

  constructor(private http: HttpClient) { }

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

  public GetUserID(): Observable<string>
  {
    if (this.userID === undefined)
    {
      const idObservable: Observable<string> = this
        .http
        .get<string>('http://localhost:3000/spotify/userID');

      idObservable.subscribe((id: string) =>
      {
        this.userID = id;
      });

      return idObservable;
    }
    else
    {
      return of(this.userID);
    }
  }
}

export class User
{

}
