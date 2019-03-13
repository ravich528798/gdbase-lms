import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlreadyExistsValidator, MatchPassword, PatternValidator } from '../users-tab/users-tab.component';
import { HttpClient } from '@angular/common/http';
import { URL_CHECK_USERNAME_AVAILABILITY, URL_CHECK_EMAIL_AVAILABILITY, URL_GET_USER, URL_CHECK_PASSWORD, URL_CHANGE_PASSOWRD, URL_UPDATE_PROFILE, URL_UPDATE_USER_DATA } from 'src/app/api';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { debounceTime, take, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-manage-tab',
  templateUrl: './manage-tab.component.html',
  styleUrls: ['./manage-tab.component.scss']
})
export class ManageTabComponent implements OnInit {
  public inEditMode: boolean = false;
  public editProfile: FormGroup;
  public editDP: FormGroup;
  public userdata: any;
  public userInnerData: any = {};
  public placeholder: string = "assets/img/user.svg";
  private mobileNumPattern = new RegExp(/^(?:(?:\+)(33|32)|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/);

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.editProfile = this.fb.group({});
    this.editDP = this.fb.group({
      profilePicture:[this.placeholder]
    })
    this.getUser().subscribe(res => {
      this.userdata = res[0];
      try{
        this.userInnerData = JSON.parse(this.userdata.userdata);
        if(this.userInnerData.dp){
          this.placeholder = this.userInnerData.dp;
          this.ref.detectChanges();
        }
      }catch(err){
        // console.log(err);
      }
    })
  }

  onEdit() {
    this.createFormGroup();
    this.inEditMode = !this.inEditMode;
    this.inEditMode && this.populateForm(this.userdata);
  }

  updateDP(res:string){
    this.userInnerData.dp = res;
    this.http.post(URL_UPDATE_USER_DATA,{studentID: this.userdata.studentID, userdata: JSON.stringify(this.userInnerData)})
        .subscribe(
          (res:boolean) => {
            if(!res){
              this.openSnackBar('Unable to update Pictrue. Please try again');
            }
          },
          err => {
            console.log(err);
            this.openSnackBar('Unable to update Pictrue. Please try again');
          }
        )
  } 

  createFormGroup() {
    this.editProfile = this.fb.group({
      firstname: ["",
        Validators.required
      ],
      lastname: ["",
        Validators.required
      ],
      username: ["",
        Validators.required,
        AlreadyExistsValidatorForEdit.validate(this.http, URL_CHECK_USERNAME_AVAILABILITY, () => this.userdata ? this.userdata.username : null)
      ],
      email: ["",
        Validators.required,
        AlreadyExistsValidatorForEdit.validate(this.http, URL_CHECK_EMAIL_AVAILABILITY, () => this.userdata ? this.userdata.email : null)
      ],
      mobileNumber: ['',
        Validators.minLength,
        PatternValidator.validate(this.mobileNumPattern)
      ]
    })
  }
  populateForm(data) {
    this.editProfile.get('firstname').setValue(data.firstname);
    this.editProfile.get('lastname').setValue(data.lastname);
    this.editProfile.get('username').setValue(data.username);
    this.editProfile.get('email').setValue(data.email);
    this.editProfile.get('mobileNumber').setValue(data.mobile);
  }


  get firstname() {
    return this.editProfile.get('firstname');
  }
  get lastname() {
    return this.editProfile.get('lastname');
  }
  get username() {
    return this.editProfile.get('username');
  }
  get email() {
    return this.editProfile.get('email');
  }

  get mobileNumber() {
    return this.editProfile.get('mobileNumber');
  }

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, { action: 'username', payload: localStorage.getItem('gdbaseLMSToken').split("|")[0] });

  updateProfile = (data: any): Observable<any> => this.http.post<any>(URL_UPDATE_PROFILE, data);

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialog, {
      width: '60vw',
      data: this.userdata,
      disableClose: true
    });
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  saveForm() {
    if (this.editProfile.valid) {
      this.userdata.firstname = this.firstname.value;
      this.userdata.lastname = this.lastname.value;
      this.userdata.email = this.email.value;
      this.userdata.mobile = this.mobileNumber.value;
      this.userdata.username = this.username.value;
      this.updateProfile(this.userdata)
        .subscribe(
          (res: boolean) => {
            if (res) {
              this.inEditMode = false;
              this.openSnackBar("Profile has been updated");
            } else {
              this.openSnackBar("Something went wrong. Please try again");
            }
          },
          err => {
            console.log(err);
            this.openSnackBar("Something went wrong. Please try again");
          }
        )
    } else {
      this.openSnackBar("Please fix the errors, before upadting your profile");
    }
  }

  cancleEdit() {
    this.inEditMode = false;
  }

  changePassword() {
    this.openChangePasswordDialog();
  }

}

@Component({
  selector: 'change-password-dialog',
  templateUrl: 'change-password.dialog.html',
})

export class ChangePasswordDialog {
  public isLinear = true;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public validCurrentPassword: boolean;

  @ViewChild('stepper') _stepper: MatStepper;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordDialog>,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      currentPassword: ['',
        Validators.required,
        currentPasswordValidator.validate(this.validCurrentPassword)]
    });
    this.secondFormGroup = this._formBuilder.group({
      newPassword: ['',
        Validators.required
      ],
      confirmPassword: ['',
        Validators.required,
        MatchPassword.validate()
      ]
    });
  }

  checkPassword = (_studentID: string, _password: string): Observable<any> => this.http.post<any>(URL_CHECK_PASSWORD, { studentID: _studentID, password: _password });

  updatePassword = (_studentID: string, _password: string): Observable<any> => this.http.post<any>(URL_CHANGE_PASSOWRD, { studentID: _studentID, password: _password });

  clearMatchedPassword() {
    this.confirmPassword.setValue('');
  }

  get newPassword() {
    return this.secondFormGroup.get('newPassword');
  }

  get confirmPassword() {
    return this.secondFormGroup.get('confirmPassword');
  }

  submitCurrentPassword() {
    this.checkPassword(this.data.studentID, this.firstFormGroup.get('currentPassword').value)
      .subscribe(
        (res: boolean) => {
          if (!res) {
            this.validCurrentPassword = res;
            this.firstFormGroup.get('currentPassword').setErrors({ currentPassword: false });
          } else {
            this._stepper.next();
          }
        },
        err => {
          console.log(err);
        }
      )
  }

  submitNewPassword() {
    if (this.secondFormGroup.valid) {
      this.updatePassword(this.data.studentID, this.newPassword.value)
        .subscribe(
          (res: boolean) => {
            if (res) {
              this._stepper.next();
            } else {
              this.openSnackBar('Something went wrong. Please try again');
            }
          },
          err => {
            console.log(err);
          }
        )
    }
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}

export class currentPasswordValidator {
  static validate = (validuser: boolean) => () => new Promise(resolve => !validuser ? resolve(null) : resolve({ correctPassword: false }))
}

export class AlreadyExistsValidatorForEdit {
  static validate = (http: HttpClient, url: string, currentVal:Function) => {
    return (ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => http.post(url, ctrl.value.toLowerCase()).pipe(
      debounceTime(500),
      take(1),
      map(res => (res === '0' || currentVal() === ctrl.value.toLowerCase()) ? null : { unique: false }),
      catchError(() => null)
    )
  }
}