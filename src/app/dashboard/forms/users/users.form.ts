import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Countries} from '../../../countries';
import {UserService} from '../../../services/user.service';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../model/rolesAndPermissions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-users-dialog-from',
  templateUrl: 'users.form.html',
  styleUrls: ['./users.form.css']
})

export class UsersFormDialogComponent implements OnInit, AfterViewInit {

  form_action = 'Registration';
  userForm: FormGroup;
  countries: object[] = Countries;
  roles_options: Role[];
  user: User;

  constructor(
    public dialogRef: MatDialogRef<User>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder,
    private userService: UserService,
    private rolesService: RolesService
  ) {
    this.getRoles();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.form_action = 'Edit User';
      this.userService.getUserById(this.data.id).subscribe(response => {
        this.user = response;
        this.userForm.get('first_name').setValue(response.first_name);
        this.userForm.get('last_name').setValue(response.last_name);
        this.userForm.get('username').setValue(response.username);
        this.userForm.get('email').setValue(response.email);
        this.userForm.get('roles').setValue(response.roles.map(function (role) {
          return role.id;
        }));

        if (response.profile) {
          this.userForm.get('profile.about_me').setValue(response.profile.about_me);

          if (response.profile.address) {
            const address = JSON.parse(response.profile.address);
            this.userForm.get('profile.address.city').setValue(address.city);
            this.userForm.get('profile.address.street_address').setValue(address.street_address);
            this.userForm.get('profile.address.country').setValue(address.country);
            this.userForm.get('profile.address.postal_code').setValue(address.postal_code);
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {

  }

  getRoles() {
    this.rolesService.getRoles().subscribe(response => {
      this.roles_options = response.roles;
    });
  }

  createForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', [Validators.required]],
      profile: this.fb.group({
        about_me: [''],
        address: this.fb.group({
          street_address: [''],
          city: [''],
          country: [''],
          postal_code: [''],
        })
      })
    });
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      return;
    }
    const form_data = this.userForm.value;

    if (this.user.id) {
      form_data.id = this.user.id;
    }

    this.userService.addOrUpdate(form_data).subscribe(response => {
      console.log(response);
    });
  }

  getErrorMessage(ControlName: FormControl) {
    return ControlName.hasError('required') ? 'You must enter a value' :
      ControlName.hasError('email') ? 'Not a valid email' :
        ControlName.hasError('minlength') ? `The value must be ${ControlName.errors.minlength.requiredLength} or greater` : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
