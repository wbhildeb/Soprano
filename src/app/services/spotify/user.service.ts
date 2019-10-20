import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
      const idObservable: Observable<HttpResponse<string>> = this
        .http
        .get<string>('http://localhost:3000/spotify/userID', {
          withCredentials: true,
          observe: 'response'
        });

      idObservable.subscribe((res: HttpResponse<string>) =>
      {
        if (res.ok)
        {
          this.userID = res.body;
        }
      });

      return idObservable.pipe(
        map((res: HttpResponse<string>) =>
        {
          if (res.ok) { return res.body; }
          else { throwError(res.body); }
        })
      );
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
