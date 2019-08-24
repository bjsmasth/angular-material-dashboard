import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routes';
import {
  MatButtonModule,
  MatRadioModule,
  MatInputModule,
  MatMenuModule,
  MatCheckboxModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatSelectModule, MatAutocompleteModule, MatGridListModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HomeComponent} from './dashboard/home/home.component';
import {ProfileComponent} from './dashboard/profile/profile.component';
import 'hammerjs';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {FigurecardComponent} from './shared/figurecard/figurecard.component';
import {ImagecardComponent} from './shared/imagecard/imagecard.component';
import {TableComponent} from './dashboard/table/table.component';
import {NotificationComponent} from './dashboard/notification/notification.component';
import {MsgIconBtnComponent} from './shared/msgiconbtn/msgiconbtn.component';
import {SweetAlertComponent} from './dashboard/sweetalert/sweetalert.component';
import {LoginComponent} from './page/login/login.component';
import {RootComponent} from './dashboard/root/root.component';
import {RegisterComponent} from './page/register/register.component';
import {LockComponent} from './page/lock/lock.component';
import {HeaderComponent} from './shared/header/header.component';
import {FooterComponent} from './shared/footer/footer.component';
import {SettingsComponent} from './dashboard/settings/settings.component';
import {PriceTableComponent} from './dashboard/component/pricetable/pricetable.component';
import {PanelsComponent} from './dashboard/component/panels/panels.component';

import {SettingsService} from './services/settings.service';
import {WizardComponent} from './dashboard/component/wizard/wizard.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {ErrorInterceptor} from './interceptor/error.interceptor';
import {DatePipe} from '@angular/common';
import {UsersComponent} from './dashboard/users/users.component';
import {UsersFormDialogComponent} from './dashboard/forms/users/users.form';
import { ChatComponent } from './chat/chat.component';
import {DeviceDetectorModule} from 'ngx-device-detector';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    FigurecardComponent,
    ImagecardComponent,
    TableComponent,
    NotificationComponent,
    MsgIconBtnComponent,
    SweetAlertComponent,
    LoginComponent,
    RootComponent,
    RegisterComponent,
    LockComponent,
    HeaderComponent,
    FooterComponent,
    SettingsComponent,
    PriceTableComponent,
    PanelsComponent,
    WizardComponent,
    UsersComponent,
    UsersFormDialogComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatGridListModule,
    DeviceDetectorModule.forRoot()
  ],
  entryComponents: [UsersFormDialogComponent],
  providers: [
    SettingsService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    DatePipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
