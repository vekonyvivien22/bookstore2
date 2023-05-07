import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRegisterData } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: { _id: string; username: string; email: string } | null = null;

  constructor(private http: HttpClient) {}

  register(userData: UserRegisterData): Observable<any> {
    return this.http.post(environment.serverUrl + '/user/reg', userData, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/user/login',
      { username, password },
      { withCredentials: true, responseType: 'json', observe: 'response' }
    );
  }

  logout(): Observable<any> {
    return this.http.post(environment.serverUrl + '/user/logout', null, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  async checkAuthenticated(): Promise<boolean> {
    return lastValueFrom(
      this.http
        .get<boolean>(environment.serverUrl + '/user/is-authenticated', {
          withCredentials: true,
        })
        .pipe(
          take(1),
          map((loggedIn: boolean) => {
            return loggedIn;
          })
        )
    );
  }
}
