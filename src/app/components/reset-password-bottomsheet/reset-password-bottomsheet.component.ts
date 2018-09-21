import { Component, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { URL_GET_USER, URL_SEND_PASSWORD_REST_MAIL } from '../../api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PassRestTimer {
  hours: Number;
  mins: Number;
  secs: Number;
}

@Component({
  selector: 'app-reset-password-bottomsheet',
  templateUrl: './reset-password-bottomsheet.component.html',
  styleUrls: ['./reset-password-bottomsheet.component.scss']
})
export class ResetPasswordBottomsheetComponent {
  public resetEmail: String;
  public loading: Boolean;
  public showError: Boolean;
  public msgError: String;
  public userdata: any;
  public passRestTimer: PassRestTimer;
  public OTPState: String;
  public passOTP: String;
  public resetStage: Number;

  private Timeloop: any;
 
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ResetPasswordBottomsheetComponent>,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.resetStage = 2;
    this.loading = false;
    this.showError = false;
    this.userdata = {
      firstname: 'Godwin VC',
      email: 'godwin@godwinvc.com',
      OTP:  '1234'
    }
  }

  // Stage  1
  onResetEmailChange() {
    this.showError = false;
    this.msgError = "";
  }
  checkEmail() {
    this.loading = true;
    this.http.post(URL_GET_USER, { action: 'email', payload: this.resetEmail })
      .subscribe(
        res => {
          this.loading = false;
          if (Array.isArray(res)) {
            if (res.length === 0) {
              this.showError = true;
              this.msgError = "Sorry, we don't recognize this email address";
            } else {
              this.userdata = res[0];
              this.sendMailWithOTP()
                .then(res => {
                  if (res === 'MailDelivered') {
                    this.resetStage = 2;
                  } else {
                    alert("Failed to Send OTP. Please try again");
                  }
                })
                .catch(err => {
                  alert("Failed to Send OTP. Please try again");
                  console.log(err);
                })
            }
          } else {
            alert('Something went wrong. Please try again');
          }
          this.changeDetectorRef.detectChanges();
        },
        err => {
          this.loading = false;
          alert('Network Error. Please try again');
          console.log(err);
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

    this.Timeloop = setInterval(function () {
      const now: number = new Date().getTime();
      const distance: number = countDownDate - now;
      this.passRestTimer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.passRestTimer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.passRestTimer.secs = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 1000) {
        this.OTPState = "expired";
        localStorage.removeItem('gdbaseOTP');
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.Timeloop);
    console.log('Timer Stopped');
  }

  checkOTP() {
    if (this.passOTP == localStorage.getItem('gdbaseOTP')) {
      this.OTPState = 'approved';
      this.resetStage = 3;
      this.stopTimer();
    } else {
      console.log("Incorrect ran");
      this.OTPState = 'incorrect';
    }
  }

  onSubmit() {
    switch (this.resetStage) {
      case 1:
        this.checkEmail();
        break;
      case 2:

      default:
        break;
    }
  }
}
