import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {Token} from '../model/user';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentSessionSubject: BehaviorSubject<Token>;
  public currentUser: Observable<Token>;

  constructor(private http: HttpClient) {
    this.currentSessionSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('current_session')));
    this.currentUser = this.currentSessionSubject.asObservable();
  }

  public get getSessionToken(): Token {
    return this.currentSessionSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.API_END_POINT + environment.API_VERSION}/auth/login`, {email, password})
      .pipe(map(session => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('current_session', JSON.stringify(session));
        this.currentSessionSubject.next(session);
        return session;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('current_session');
    this.currentSessionSubject.next(null);
  }
}
