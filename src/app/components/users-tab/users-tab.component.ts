import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { URL_GET_ALL_USERS, URL_DELETE_USER, URL_CHECK_USERNAME_AVAILABILITY, URL_CHECK_EMAIL_AVAILABILITY, URL_ADD_USER } from '../../api';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, map, take, catchError } from "rxjs/operators";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  username: string;
  usertype: string;
  password: string;
}

interface ConfirmDeleteDialogData {
  username: string;
}

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class UsersTabComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'email', 'mobile'];
  public dataSource: MatTableDataSource<UserData>;
  public totalUsers: any[];
  public expandedElement: UserData;
  public today: number = Date.now();
  public currentUser: UserData;
  // create user form 
  public addUserFG: FormGroup;

  private pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
  private mobileNumPattern = new RegExp(/^(?:(?:\+)(33|32)|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog, private fb: FormBuilder, public snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers().subscribe((data: any[]) => { this.dataSource.data = data; });
    this.addUserFG = this.fb.group({
      firstname: ['',
        Validators.required
      ],
      lastname: ['',
        Validators.required
      ],
      username: ['',
        Validators.required,
        AlreadyExistsValidator.validate(this.http, URL_CHECK_USERNAME_AVAILABILITY)
      ],
      email: ['',
        Validators.required,
        AlreadyExistsValidator.validate(this.http, URL_CHECK_EMAIL_AVAILABILITY)
      ],
      newPassword: ['',
        Validators.required,
        PatternValidator.validate(this.pattern)
      ],
      confirmPassword: ['',
        Validators.required,
        MatchPassword.validate()
      ],
      userType: ['student'],
      mobileNumber: ['',
        Validators.minLength,
        PatternValidator.validate(this.mobileNumPattern)
      ]
    })
  }

  clearMatchedPassword() {
    this.confirmPassword.setValue('');
  }
  get firstname() {
    return this.addUserFG.get('firstname');
  }
  get lastname() {
    return this.addUserFG.get('lastname');
  }
  get username() {
    return this.addUserFG.get('username');
  }
  get email() {
    return this.addUserFG.get('email');
  }

  get newPassword() {
    return this.addUserFG.get('newPassword');
  }

  get confirmPassword() {
    return this.addUserFG.get('confirmPassword');
  }

  get userType() {
    return this.addUserFG.get('userType');
  }
  get mobileNumber() {
    return this.addUserFG.get('mobileNumber');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getAllUsers = (): Observable<UserData[]> => this.http.get<UserData[]>(URL_GET_ALL_USERS);

  deleteUser = (userData) => {
    this.http.post(URL_DELETE_USER, userData)
      .subscribe(res => {
        this.dataSource.data = this.dataSource.data.filter(el => el.username !== userData.username);
      })
  }

  openDeleteConfirmDialog(): void {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '250px',
      data: { user: this.currentUser, deleteUser: this.deleteUser.bind(this) }
    });

    deleteDialogRef.beforeClose().subscribe(res => {
      if (res) {
        deleteDialogRef.disableClose = true;
      }
    })
  }

  toggleExpandRow(currrentUser) {
    this.currentUser = currrentUser;
  }
  addNewUser() {
    if (this.addUserFG.valid) {
      this.http.post<String>(URL_ADD_USER, this.addUserFG.value)
        .subscribe(
          res => {
            if (res === 'ADDED') {
              this.openSnackBar(`Added ${this.firstname.value} as ${this.userType.value}`);
              this.addUserFG.reset();
              this.addUserFG.markAsUntouched();
              Object.keys(this.addUserFG.controls).forEach((name) => {
                let control = this.addUserFG.controls[name];
                control.setErrors(null);
              });
              this.getAllUsers().subscribe((data: any[]) => { this.dataSource.data = data; });
            }
          },
          error => {
            this.openSnackBar(`Something went wrong. Please try again`);
            console.log(error);
          }
        );
    }
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}

@Component({
  selector: 'confrim-delete-dialog',
  templateUrl: 'confrim-delete.dialog.html',
})

export class ConfirmDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    data.deleteUser(data.user);
  }

}

export class AlreadyExistsValidator {
  static validate = (http: HttpClient, url) => (ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => http.post(url, ctrl.value.toLowerCase()).pipe(
    debounceTime(500),
    take(1),
    map(res => res === '0' ? null : { unique: false }),
    catchError(() => null)
  )
}

export class MatchPassword {
  static validate = () => (crtl: AbstractControl) => new Promise(resolve => crtl.parent.get('newPassword').value === crtl.value ? resolve(null) : resolve({ matched: false }));
}

export class PatternValidator {
  static validate = (pattern: RegExp) => (ctrl: AbstractControl) => new Promise(resolve => pattern.test(ctrl.value) || ctrl.value === "" || ctrl.value === null ? resolve(null) : resolve({ matched: false }));
}