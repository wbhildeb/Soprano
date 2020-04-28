import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SopranoAPIService
{
  constructor(private http: HttpClient) {}

  /**
   * @param path of the get request
   * @param parameters the string or string[] query parameters of the get request
   */
  Get<T>(path: string, parameters?: {[param: string]: string | string[]}): Observable<HttpResponse<T>>
  {
    parameters = parameters || {};
    return this
      .http
      .get<T>(`/api/soprano${path}`, {
        withCredentials: true,
        observe: 'response',
        params: parameters
      });
  }

  /**
   * @param path of the post request
   * @param body of the post request
   */
  Post<T>(path: string, body: T): Observable<T>
  {
    const httpOptions = {
      withCredentials: true,
      headers: new HttpHeaders({
        ContentType:  'application/json',
      })
    };
    return this.http
        .post<T>(`/api/soprano${path}`, body, httpOptions);
  }

  /**
   * @param path the url to jump to
   */
  Redirect(path: string)
  {
    location.href = `/api/soprano${path}`;
  }
}
