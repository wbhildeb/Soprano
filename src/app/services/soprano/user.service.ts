import { UserModel } from './../../models/soprano/user.model';
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
    location.href = '/api/soprano/auth/logout';
  }

  public NotMe(): void
  {
    location.href = '/api/soprano/auth/notme';
  }

  public LogIn(): void
  {
    location.href = '/api/soprano/auth/login';
  }

  public GetUser(): Observable<UserModel>
  {
    const userObservable: Observable<HttpResponse<string>> = this
      .http
      .get<string>('/api/soprano/user/details', {
        withCredentials: true,
        observe: 'response'
      });

    return userObservable.pipe(
      map((res: HttpResponse<string>) =>
      {
        if (res.ok)
        {
          return new UserModel(res.body as any);
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
        .get<string>('/api/soprano/user/id', {
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
