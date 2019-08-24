import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {InvalidLogin} from '../../model/user';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorResponse: BehaviorSubject<InvalidLogin>;

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.min(8)
      ]],
      remember_me: ['']
    });
  }

  loginUser() {

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.auth.login(email, password).subscribe(response => {
      this.router.navigate(['dashboard']);
    }, errors => {
      this.errorResponse = errors
    });
  }

  getErrorMessage(ControlName: string): string {
    const obj = this.loginForm.controls[ControlName];

    return obj.hasError('required') ? 'You must enter a value' :
      obj.hasError('email') ? 'Not a valid email' :
        obj.hasError('minlength') ? `The value must be ${obj.errors.minlength.requiredLength} or greater` : '';
  }
}
