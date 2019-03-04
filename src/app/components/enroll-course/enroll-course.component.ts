import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { URL_GET_ALL_COURSES } from 'src/app/api';
import { HttpClient } from '@angular/common/http';
import { CourseData, CurrentUser, Userdata } from 'src/app/utils/interfaces';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';

@Component({
  selector: 'app-enroll-course',
  templateUrl: './enroll-course.component.html',
  styleUrls: ['./enroll-course.component.scss']
})
export class EnrollCourseComponent implements OnInit {

  public allCourses: CourseData[] = [];
  public courses: CourseData[] = [];
  private alreadyEnrolled: string[] = [];
  public enrollDisable = true;
  public currentUser: CurrentUser;
  @ViewChild(MatSelectionList) selectedCourses: MatSelectionList;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EnrollCourseComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public parentCurrentUser: CurrentUser
  ) { }

  ngOnInit() {
    this.currentUser = { ...this.parentCurrentUser };
    try {
      if (this.currentUser.userdata) {
        const userData: Userdata = JSON.parse(this.currentUser.userdata);
        this.currentUser.userdata = userData;
        console.log(this.currentUser.userdata);
        if (userData.enrolled) {
          this.alreadyEnrolled = userData.enrolled;
        }
      }
    }
    catch (err) {
      console.log(err);
    }
    this.getAllCourses()
      .subscribe(
        (res: CourseData[]) => {
          this.allCourses = res.filter(course => this.alreadyEnrolled.indexOf(course.course_id) === -1);
          this.courses = this.allCourses;
        },
        err => {
          console.log(err);
        }
      )
  }

  getAllCourses() {
    return this.http.get(URL_GET_ALL_COURSES);
  }

   applyFilter(value) {
    this.courses = this.allCourses;
    this.courses = this.allCourses.filter(course => (course.course_name).toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  toggleSelected(course: CourseData) {
    this.enrollDisable = this.selectedCourses.selectedOptions.selected.length === 0;
    const index = this.allCourses.findIndex(i => i.course_id === course.course_id);
    this.allCourses[index]['selected'] = !this.allCourses[index]['selected'];
  }

  postEnroll() {
    this.enrollDisable = true;
    this.allCourses.forEach(course => {
      if (course['selected']) {
        if (!this.currentUser.userdata) {
          this.currentUser.userdata = {
            enrolled: []
          }
        }
        this.currentUser.userdata.enrolled.push(course.course_id);
      }
    })

    console.log(this.currentUser);
  }

}
