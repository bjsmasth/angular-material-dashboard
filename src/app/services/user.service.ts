import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Users} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Users> {
    return this.http.get<Users>(`${environment.API_END_POINT + environment.API_VERSION}/users`);
  }
}
