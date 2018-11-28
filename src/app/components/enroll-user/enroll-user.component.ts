import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_GET_ALL_USERS, URL_ENROLL_USERS } from 'src/app/api';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-enroll-user',
  templateUrl: './enroll-user.component.html',
  styleUrls: ['./enroll-user.component.scss']
})
export class EnrollUserComponent implements OnInit {

  public allUsers = [];
  public users;
  public enrollDisable = true;
  @ViewChild(MatSelectionList) selectedUsers: MatSelectionList;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EnrollUserComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public courseData
  ) { }

  ngOnInit() {
    this.getAllUsers().subscribe(data => {
      if (this.courseData.course_data.enrolled) {
        this.allUsers = data.filter(user => this.courseData.course_data.enrolled.indexOf(user.username) === -1);
      } else {
        this.allUsers = data;
      }
      this.users = this.allUsers;
    });
  }

  getAllUsers = (): Observable<any> => this.http.get<any>(URL_GET_ALL_USERS);
  enrollUsers = (data): Observable<any> => this.http.post<any>(URL_ENROLL_USERS, data);

  applyFilter(value) {
    this.users = this.allUsers;
    this.users = this.allUsers.filter(user => (user.firstname + user.lastname).toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }
  toggleSelected(user) {
    this.enrollDisable = this.selectedUsers.selectedOptions.selected.length === 0;
    const index = this.allUsers.findIndex(i => i.username === user.username);
    this.allUsers[index].selected = !this.allUsers[index].selected;
  }

  postEnroll() {
    this.enrollDisable = true;
    this.allUsers.forEach(user => {
      if (user.selected) {
        if (!this.courseData.course_data.enrolled) {
          this.courseData.course_data.enrolled = [];
        }
        this.courseData.course_data.enrolled.push(user.username);
      }
    });
    this.enrollUsers(this.courseData)
      .subscribe(res => {
        if (res === 'UPDATED') {
          this.dialogRef.close();
          this.openSnackBar(`Students Enrolled Successfully`);
        } else {
          console.log(res);
          this.openSnackBar(`Something went wrong. Please try again`);
        }
      },
        err => {
          console.log(err);
          this.openSnackBar(`Something went wrong. Please try again`);
        }
      )
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
