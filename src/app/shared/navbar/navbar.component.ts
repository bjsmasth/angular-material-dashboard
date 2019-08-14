import {Component, OnInit, Input} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
  }

  onLogout(event) {
    event.preventDefault;
    this.auth.logout();
  }

  menuClick() {
    // document.getElementById('main-panel').style.marginRight = '260px';
  }
}
