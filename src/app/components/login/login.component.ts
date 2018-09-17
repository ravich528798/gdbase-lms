import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_LOGIN, URL_GET_USER } from '../../api';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material';
import { ResetPasswordBottomsheetComponent } from '../reset-password-bottomsheet/reset-password-bottomsheet.component';

interface loginRes {
  data: string;
}

interface resetData {
  firstname: String;
  email: String;
  activationCode: Number;

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginFG: FormGroup;
  public loginError: Boolean;
  public passOTP: String;
  public OTPState: String;
  public passResetStage: any;
  public resetEmail: String;
  @ViewChild('loginFormRoot') loginFromRoot;


  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder, private resetPasswordSheet: MatBottomSheet) { }

  ngOnInit() {
    document.querySelector('video').muted = false;
    this.loginError = false;
    this.loginFG = this.fb.group({
      username: ['',
        Validators.required,
        usernamePasswordValidator.validate(this.loginError)
      ],
      password: [
        '',
        Validators.required,
        usernamePasswordValidator.validate(this.loginError)
      ]
    })
  }
  get username() {
    return this.loginFG.get('username')
  }
  get password() {
    return this.loginFG.get('password')
  }
  onChange() {
    this.loginError = false;
  }
  loginHandler() {
    this.http.post(URL_LOGIN, { username: this.username.value, password: this.password.value }).subscribe((data) => {
      if (data !== 'ERROR') {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.loginError = true;
        for (const control in this.loginFG.controls) {
          this.loginFG.controls[control].setErrors({ matched: false });
        }
      }
    })
  }
  openResetPasswordBottomSheet(): void {
    this.resetPasswordSheet.open(ResetPasswordBottomsheetComponent);
  }
  passwordRest = function (stage) {

  }
  sendResetMail() {
    localStorage.setItem('gdbaseLMSOTP', this.generateOTP());
    this.http.post(URL_GET_USER, { action: 'email', payload: this.resetEmail })
      .subscribe(res => {
        console.log(res);
      })

  }

  generateOTP() {
    return Math.floor(Math.random() * 10000).toString();
  }

  stopTimer() {

  }
  checkOTP() {
    if (this.passOTP == localStorage.getItem('gdbaseOTP')) {
      this.OTPState = 'approved';
      this.stopTimer();
    } else {
      console.log("Incorrect ran");
      this.OTPState = 'incorrect';
    }
  }
  changePassword() {

  }
}

export class usernamePasswordValidator {
  static validate = (validUser) => (ctrl: AbstractControl) => new Promise(resolve => !validUser ? resolve(null) : resolve({ matched: false }));
}