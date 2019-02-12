import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {FlexLayoutModule} from "@angular/flex-layout";

import { MaterialModule } from './material.module';
import { LMSRouter } from "./config/router";
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { DashboardTabComponent, ConfirmDeleteCourseDialog } from './components/dashboard-tab/dashboard-tab.component';
import { UsersTabComponent, ConfirmDeleteDialog } from './components/users-tab/users-tab.component';
import { ManageTabComponent, ChangePasswordDialog } from './components/manage-tab/manage-tab.component';
import { CoursesTabComponent } from './components/courses-tab/courses-tab.component';
import { GlobalInterceptor } from './config/HttpInterceptor';
import { ResetPasswordBottomsheetComponent } from './components/reset-password-bottomsheet/reset-password-bottomsheet.component';
import { StudentShellComponent } from './components/student-shell/student-shell.component';
import { StundentCoursesComponent } from './components/stundent-courses/stundent-courses.component';
import { StundentDashboardComponent } from './components/stundent-dashboard/stundent-dashboard.component';
import { StundentSettingsComponent } from './components/stundent-settings/stundent-settings.component';
import { EnrollUserComponent } from './components/enroll-user/enroll-user.component';
import { EnrollCourseComponent } from './components/enroll-course/enroll-course.component';
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ScormPlayerComponent } from './components/scorm-player/scorm-player.component';
import { OpenLinkInNewWindowDirective } from './directives/newTab.directive';
import { WindowWrapper, getWindow } from './directives/WindowWrapper';

const lmsRoutes: Routes = LMSRouter;

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(lmsRoutes),
    ReactiveFormsModule,
    QuillModule,
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AdminShellComponent,
    DashboardTabComponent,
    UsersTabComponent,
    ManageTabComponent,
    CoursesTabComponent,
    ConfirmDeleteDialog,
    ConfirmDeleteCourseDialog,
    ResetPasswordBottomsheetComponent,
    StudentShellComponent,
    StundentCoursesComponent,
    StundentDashboardComponent,
    StundentSettingsComponent,
    EnrollUserComponent,
    EnrollCourseComponent,
    PhotoUploadComponent,
    ReportsComponent,
    ScormPlayerComponent,
    OpenLinkInNewWindowDirective,
    ChangePasswordDialog
  ],
  entryComponents: [ConfirmDeleteDialog,ConfirmDeleteCourseDialog, ResetPasswordBottomsheetComponent, EnrollUserComponent, ChangePasswordDialog],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    },
    {provide: WindowWrapper, useFactory: getWindow}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
