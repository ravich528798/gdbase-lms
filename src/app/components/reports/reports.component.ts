import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_GET_USER, URL_GET_ENROLLED_COURSES, URL_UPDATE_USER_DATA } from 'src/app/api';
import { isNull } from 'util';
import { CourseData } from 'src/app/utils/interfaces';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public userId: string;
  public currentUser: any;
  public courses: [any];
  public decodeURI: any;
  public userData: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.decodeURI = decodeURI;
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUser()
      .subscribe(
        res => {
          this.currentUser = res[0];
          if (this.currentUser.userdata) {
            this.userData = JSON.parse(this.unescapeSingleQuote(this.currentUser.userdata));
            if (this.userData.course_data) {
              this.userData.course_data = JSON.parse(this.unescapeSingleQuote(this.userData.course_data));
            }
            this.currentUser.userData = this.userData;
            if (this.userData.enrolled) {
              let _enrolled: string[] = this.removeDuplicates(this.userData.enrolled);
              if (_enrolled.length !== this.userData.enrolled.length) {
                this.userData.enrolled = _enrolled;
                this.updateUserdata()
                  .subscribe(
                    res => {
                      console.log(res);
                    },
                    err => {
                      console.log(err);
                    }
                  )
              }
              this.getEnrolledCourses(_enrolled)
                .subscribe(res => {
                  console.log(res);
                  this.courses = res.filter((c: CourseData) => !isNull(c));
                  if (this.courses.length !== _enrolled.length) {
                    const availbleCourses: string[] = this.courses.reduce((arr: string[], course: CourseData) => {
                      arr.push(course.course_id);
                      return arr;
                    }, [])
                    _enrolled = _enrolled.filter((courseID: string) => availbleCourses.includes(courseID));
                    this.userData.enrolled = _enrolled;
                    this.updateUserdata()
                      .subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      )
                  }
                })
            }
          }

        },
        err => {
          console.log(err);
        }
      )
  }
  escapeSignleQuote(str) {
    return str.replace(/\'/g, "\\'");
  }

  unescapeSingleQuote(str) {
    return str.replace(/\\'/g, "'");
  }
  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, {
    action: 'studentID',
    payload: this.userId
  });

  getEnrolledCourses = (courseIDs): Observable<any> => this.http.post<any>(URL_GET_ENROLLED_COURSES, { ids: courseIDs });

  removeDuplicates = (arr: string[]): string[] => [...new Set(arr)];

  updateUserdata = (): Observable<any> => this.http.post<any>(URL_UPDATE_USER_DATA, { studentID: this.currentUser.studentID, userdata: JSON.stringify(this.userData) });

  parseJson(string) {
    return JSON.parse(string);
  }

}
