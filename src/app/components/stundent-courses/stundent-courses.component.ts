import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_GET_USER, URL_GET_ENROLLED_COURSES, URL_COURSES } from 'src/app/api';
import { isNull } from 'util';
import { CourseData, CurrentUser } from 'src/app/utils/interfaces';
import { URL_UPDATE_USER_DATA } from '../../api/gdbaseAPI';

@Component({
  selector: 'app-stundent-courses',
  templateUrl: './stundent-courses.component.html',
  styleUrls: ['./stundent-courses.component.scss']
})
export class StundentCoursesComponent implements OnInit {
  public courses = new Array<CourseData>();
  public currentUser:CurrentUser;
  public courseURL:string = URL_COURSES;
  public decodeURI: any;
  public userData:any;
  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.decodeURI = decodeURI;
    this.getUser().subscribe(res => {
      this.currentUser = res[0];
      this.userData = JSON.parse(this.currentUser.userdata);
      if (this.userData.enrolled) {
        const _enrolled:string[] = this.removeDuplicates(this.userData.enrolled);
        if(_enrolled.length !== this.userData.enrolled.length){
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
              this.courses = res.filter((c:CourseData) => !isNull(c));
            })
      }
    })
  }

  removeDuplicates = (arr:string[]):string[] => [...new Set(arr)];

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, { action: 'username', payload: localStorage.getItem('gdbaseLMSToken').split("|")[0] });

  getEnrolledCourses = (courseIDs): Observable<any> => this.http.post<any>(URL_GET_ENROLLED_COURSES, { ids: courseIDs });

  updateUserdata = ():Observable<any> => this.http.post<any>(URL_UPDATE_USER_DATA, { studentID: this.currentUser.studentID, userdata: JSON.stringify(this.userData)});

  parseJson(string:string) {
    return JSON.parse(string);
  }
}
