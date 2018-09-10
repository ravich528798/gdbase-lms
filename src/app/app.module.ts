import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { LMSRouter } from "./config/router";
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { DashboardTabComponent } from './components/dashboard-tab/dashboard-tab.component';
import { UsersTabComponent, ConfirmDeleteDialog } from './components/users-tab/users-tab.component';
import { ManageTabComponent } from './components/manage-tab/manage-tab.component';
import { CoursesTabComponent } from './components/courses-tab/courses-tab.component';
import { GlobalInterceptor } from './config/HttpInterceptor';

const lmsRoutes: Routes = LMSRouter;

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(lmsRoutes),
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AdminShellComponent,
    DashboardTabComponent,
    UsersTabComponent,
    ManageTabComponent,
    CoursesTabComponent,
    ConfirmDeleteDialog
  ],
  entryComponents: [ConfirmDeleteDialog],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
