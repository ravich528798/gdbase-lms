import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_GET_USER, URL_GET_ENROLLED_COURSES, URL_COURSES } from 'src/app/api';
import { isNull } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stundent-courses',
  templateUrl: './stundent-courses.component.html',
  styleUrls: ['./stundent-courses.component.scss']
})
export class StundentCoursesComponent implements OnInit {
  public courses;
  public courseURL = URL_COURSES;
  public decodeURI: any;
  public userData:any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.decodeURI = decodeURI;
    this.getUser().subscribe(res => {
      this.userData = JSON.parse(res[0].userdata);
      if (this.userData.enrolled) {
        this.getEnrolledCourses(this.userData.enrolled)
          .subscribe(res => {
            this.courses = res.filter(c => !isNull(c));
          })
      }
    })
  }

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, { action: 'username', payload: localStorage.getItem('gdbaseLMSToken').split("|")[0] });

  getEnrolledCourses = (courseIDs): Observable<any> => this.http.post<any>(URL_GET_ENROLLED_COURSES, { ids: courseIDs });

  parseJson(string) {
    return JSON.parse(string);
  }
}
