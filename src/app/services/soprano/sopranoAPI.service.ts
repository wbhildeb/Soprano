import { UserModel } from './../../models/soprano/user.model';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SopranoAPIService
{
  constructor(private http: HttpClient) {}

  /**
   * @param path of the get request
   */
  Get(path: string): Observable<HttpResponse<any>>
  {
    return this
      .http
      .get<any>(`/api/soprano${path}`, {
        withCredentials: true,
        observe: 'response'
      });
  }

  /**
   * @param path of the post request
   * @param body of the post request
   */
  Post(path: string, body: JSON): Observable<HttpResponse<any>>
  {
    const httpOptions = {
      withCredentials: true,
      headers: new HttpHeaders({
        ContentType:  'application/json',
      })
    };
    return this
        .http
        .post<any>(`/api/soprano${path}`, body, httpOptions);
  }

  /**
   * @param path the url to jump to
   */
  Href(path: string)
  {
    location.href = `/api/soprano${path}`;
  }
}
