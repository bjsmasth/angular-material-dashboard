import { Component, OnInit,  } from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private users;

  constructor(private user: UserService) { }

  ngOnInit() {
    const userData = this.user.getAll().subscribe(response => {
      this.users = response.users.data;
    });
  }

}
