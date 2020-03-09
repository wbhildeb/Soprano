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
    // HTTP request: Get /api/soprano/logout
    this.userID = undefined;
  }

  public LogIn(): void
  {
    location.href = '/api/soprano/login';
  }

  public GetUser(): Observable<User>
  {
    const userObservable: Observable<HttpResponse<string>> = this
      .http
      .get<string>('/api/soprano/userDetails', {
        withCredentials: true,
        observe: 'response'
      });

    return userObservable.pipe(
      map((res: HttpResponse<string>) =>
      {
        if (res.ok)
        {
          const userDetails = res.body as any;
          const user = new User(userDetails.id);

          if (userDetails.display_name) { user.name = userDetails.display_name; }
          if (userDetails.images && userDetails.images[0].url)
          {
            user.imageURL = userDetails.images[0].url;
          }
          return user;
        }
        else { throwError(res.body); }
      })
    );
  }

  public GetUserID(): Observable<string>
  {
    if (this.userID === undefined)
    {
      const idObservable: Observable<HttpResponse<string>> = this
        .http
        .get<string>('/api/soprano/userID', {
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
  public imageURL: string;
  public name: string;

  constructor(
    public id: string
  ){}
}
