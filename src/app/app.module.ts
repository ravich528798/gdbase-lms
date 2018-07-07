import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { LMSRouter } from "./config/router";
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';

const lmsRoutes: Routes = LMSRouter;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(lmsRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
