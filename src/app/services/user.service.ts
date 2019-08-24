import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User, UserPagination, Users} from '../model/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  get(page: number, pageSize: number, order_by: string, order: string): Observable<Users> {

    return this.http.get<Users>(`${environment.API_END_POINT + environment.API_VERSION}/users`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('per_page', pageSize.toString())
        .set('order_by', order_by.toString())
        .set('order', order.toString())
    });
  }

  addOrUpdate(user: object): Observable<Users> {
    return this.http.post<any>(`${environment.API_END_POINT + environment.API_VERSION}/users/add-or-update`, JSON.stringify(user));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.API_END_POINT + environment.API_VERSION}/users/${id}`);
  }
}
