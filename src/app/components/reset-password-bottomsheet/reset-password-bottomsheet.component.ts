import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { URL_GET_USER } from '../../api';
import { HttpClient } from '@angular/common/http';

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
  public userdata: Object;

  private resetStage: Number;

  constructor(private bottomSheetRef: MatBottomSheetRef<ResetPasswordBottomsheetComponent>, private http: HttpClient) {
    this.resetStage = 1;
    this.loading = false;
    this.showError = false;

  }
  checkEmail() {
    this.loading = true;
    this.http.post(URL_GET_USER, { action: 'email', payload: this.resetEmail })
      .subscribe(
        res => {
          this.loading = false;
          if(Array.isArray(res)){
            if(res.length === 0){
              console.log(res);
              this.showError = true;
              this.msgError = "Sorry, we don't recognize this email address";
            }else{
              this.userdata = res[0];
              console.log(this.userdata);
            }
          }else{
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

      default:
        break;
    }
  }
}
