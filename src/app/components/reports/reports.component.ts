import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_GET_USER, URL_GET_ENROLLED_COURSES } from 'src/app/api';
import { isNull } from 'util';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public userId:string;
  public currentUser:any;
  public courses:[any];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUser()
      .subscribe(
        res=>{
          this.currentUser = res[0];
          try{
            this.currentUser.userdata = JSON.parse(this.currentUser.userdata);
            this.currentUser.courses_data = JSON.parse(this.currentUser.courses_data);
          }
          catch(err){
            console.log(err);
          }
          this.currentUser.userdata && this.currentUser.userdata.enrolled && this.getEnrolledCourses(this.currentUser.userdata.enrolled)
          .subscribe(res => {
            this.courses = res.filter(c => !isNull(c));
            console.log('Enrolled Courses::',this.courses);
          })
          console.log('User Data::',this.currentUser);
        },
        err => {
          console.log(err);
        }
      )
  }

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, {
    action: 'studentID',
    payload: this.userId
  });

  getEnrolledCourses = (courseIDs): Observable<any> => this.http.post<any>(URL_GET_ENROLLED_COURSES, { ids: courseIDs });

}
