import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Role, Roles} from '../model/rolesAndPermissions';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) {
  }

  getRoles(): Observable<Roles> {
    return this.http.get<Roles>(`${environment.API_END_POINT + environment.API_VERSION}/roles`);
  }
}
