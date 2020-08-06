import { UserModel } from './../../models/soprano/user.model';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {SopranoAPIService} from './sopranoAPI.service';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private userID: string;

  constructor(private sopranoAPIService: SopranoAPIService) {}

  public LogOut(): void
  {
    this.sopranoAPIService.Redirect('/auth/logout');
  }

  public NotMe(): void
  {
    this.sopranoAPIService.Redirect('/auth/notme');
  }

  public LogIn(): void
  {
    this.sopranoAPIService.Redirect('/auth/login');
  }

  public GetUser(): Observable<UserModel>
  {
    const userObservable: Observable<HttpResponse<string>> = this
      .sopranoAPIService
      .Get<string>('/user/details');

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
        .sopranoAPIService
        .Get<string>('/user/id');

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
