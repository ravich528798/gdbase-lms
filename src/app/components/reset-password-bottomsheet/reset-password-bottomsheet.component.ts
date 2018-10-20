import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { URL_GET_USER, URL_SEND_PASSWORD_REST_MAIL, URL_CHANGE_PASSWORD } from '../../api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';

interface PassRestTimer {
  hours: number;
  mins: number;
  secs: number;
}

@Component({
  selector: 'app-reset-password-bottomsheet',
  templateUrl: './reset-password-bottomsheet.component.html',
  styleUrls: ['./reset-password-bottomsheet.component.scss']
})
export class ResetPasswordBottomsheetComponent implements OnInit {
  public resetEmail: string;
  public loading: boolean;
  public showError: boolean;
  public msgError: string;
  public userdata: any;
  public passRestTimer: PassRestTimer;
  public OTPState: string;
  public passOTP: string;
  public resetStage: number;
  public incorrectOTP: boolean = false;
  public newPass: string;
  private Timeloop: any;

  @ViewChild('resetEmailTag') resetEmailTag: NgModel;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<ResetPasswordBottomsheetComponent>,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.resetStage = 1;
    this.loading = false;
    this.showError = false;
    this.userdata = {
      firstname: '',
      email: '',
      OTP: ''
    }
    this.passRestTimer = {
      hours: 0,
      mins: 0,
      secs: 0
    }
  }

  ngOnInit() {}

  // Stage  1
  onResetEmailChange() {
   setTimeout(()=>{this.resetEmailTag.control.errors && this.resetEmailTag.control.setErrors(null)});
  }
  checkEmail() {
    this.loading = true;
    this.http.post(URL_GET_USER, { action: 'email', payload: this.resetEmail })
      .subscribe(
        res => {
          if (Array.isArray(res)) {
            if (res.length === 0) {
              this.resetEmailTag.control.setErrors({'custom': "Sorry, we don't recognize this email address"});
              console.log(this.resetEmailTag);
              this.loading = false;
            } else {
              this.userdata = res[0];
              this.sendMailWithOTP()
                .then(res => {
                  console.log(res);
                  if (res === 'MailDelivered') {
                    this.loading = false;
                    this.resetStage = 2;
                    setTimeout(() => { this.startTimer(); }, 10);
                  } else {
                    alert("Failed to Send OTP. Please try again");
                  }
                  this.changeDetectorRef.detectChanges();
                })
                .catch(err => {
                  alert("Failed to Send OTP. Please try again");
                  console.log(err);
                  this.loading = false;
                })
            }
          } else {
            this.loading = false;
            alert('Something went wrong. Please try again');
          }
          this.changeDetectorRef.detectChanges();
        },
        err => {
          this.loading = false;
          alert('Network Error. Please try again');
          this.changeDetectorRef.detectChanges();
        }
      )
  }

  generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  OTPMail = (data): Observable<any> => this.http.post<any>(URL_SEND_PASSWORD_REST_MAIL, data);

  sendMailWithOTP() {
    return new Promise((resolve, reject) => {
      localStorage.setItem('gdbaseLMSOTP', this.generateOTP());
      const data = { firstname: this.userdata.firstname, email: this.userdata.email, otp: localStorage.getItem('gdbaseLMSOTP') };
      this.OTPMail(data)
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        )
    })
  }

  // Stage 2
  startTimer() {
    const date = new Date();
    const countDownDate: number = new Date(date.setTime(date.getTime() + (0 * 60 * 60 * 1000) + (5 * 60 * 1000) + (0 * 1000))).getTime();
    this.Timeloop = setInterval(() => {
      const now: number = new Date().getTime();
      const distance: number = countDownDate - now;
      this.passRestTimer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.passRestTimer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.passRestTimer.secs = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 1000) {
        this.OTPState = "expired";
        localStorage.removeItem('gdbaseLMSOTP');
        this.stopTimer();
      }
      this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.Timeloop);
    console.log('Timer Stopped');
  }

  checkOTP() {
    this.incorrectOTP = false;
    if (this.passOTP == localStorage.getItem('gdbaseLMSOTP')) {
      this.OTPState = 'approved';
      this.resetStage = 3;
      this.stopTimer();
    } else {
      this.incorrectOTP = true;
      this.OTPState = 'incorrect';
    }
  }

  // stage 3
  changePassword() {
    this.loading = true;
    this.http.post(URL_CHANGE_PASSWORD, {
      email: this.userdata.email,
      password: this.newPass
    })
      .subscribe(res => {
        this.loading = false;
        if (res === 'changedSucessfully') {
          this.resetStage = 4;
        } else {
          alert('Something went wrong. Please try again');
        }
      },
        err => {
          this.loading = false;
          alert('Network Error. Please try again');
          console.log(err);
        }
      )
  }

  onSubmit() {
    switch (this.resetStage) {
      case 1:
        this.checkEmail();
        break;
      case 2:
        this.checkOTP();
        break;
      case 3:
        this.changePassword();
        break;
      case 4:
        this.bottomSheetRef.dismiss();
      default:
        break;
    }
  }
}
