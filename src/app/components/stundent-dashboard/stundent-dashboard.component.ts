import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_GET_USER, URL_COURSES, URL_GET_ENROLLED_COURSES, URL_UPDATE_USER_DATA } from 'src/app/api';
import { Observable } from 'rxjs';
import { isNull } from 'util';
import { CurrentUser, CourseData, StudentCoursesData } from 'src/app/utils/interfaces';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stundent-dashboard',
  templateUrl: './stundent-dashboard.component.html',
  styleUrls: ['./stundent-dashboard.component.scss']
})
export class StundentDashboardComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'date', 'author', 'status'];
  public courses = new Array<CourseData>();
  public currentUser:CurrentUser;
  public currentCourses:StudentCoursesData;
  public courseURL:string = URL_COURSES;
  public dataSource: MatTableDataSource<CourseData>;
  public decodeURI: any;
  public userData:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.decodeURI = decodeURI;
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getUser().subscribe(res => {
      this.currentUser = res[0];
      this.userData = this.parseJson(this.currentUser.userdata);
      this.currentCourses = this.parseJson(this.currentUser.courses_data);
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
              this.dataSource.data = this.courses;
            })
      }
    })
  }

  removeDuplicates = (arr:string[]):string[] => [...new Set(arr)];

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, { action: 'username', payload: localStorage.getItem('gdbaseLMSToken').split("|")[0] });
  
  getEnrolledCourses = (courseIDs:string[]): Observable<any> => this.http.post<any>(URL_GET_ENROLLED_COURSES, { ids: courseIDs });

  updateUserdata = ():Observable<any> => this.http.post<any>(URL_UPDATE_USER_DATA, { studentID: this.currentUser.studentID, userdata: JSON.stringify(this.userData)});

  getEnrolledDate(course_data:string){
    const EnrollArr = this.parseJson(course_data).enrolled.filter(i => typeof i === 'object');
    if(EnrollArr){
      const thisUser = EnrollArr.find(i => i.username === this.currentUser.username);
      if(thisUser){
        return thisUser.enrolledOn;
      }else{
        return null;
      }
    }else{
      return null;
    }
  }

  getSCORMdata(courseID:string){
    return this.currentCourses[courseID] ? this.currentCourses[courseID].cmi : false;
  }

  get CompletedCourses(){
    let count = 0;
    Object.keys(this.currentCourses).forEach(id => {
      if(this.currentCourses[id].cmi){
        const status = this.currentCourses[id].cmi.core.lesson_status.cmivalue;
        if(status === 'completed' || status === 'passed'){
          count++;
        }
      }
    })
    return count;
  }

  get InProgressCourses(){
    let count = 0;
    Object.keys(this.currentCourses).forEach(id => {
      if(this.currentCourses[id].cmi){
        const status = this.currentCourses[id].cmi.core.lesson_status.cmivalue;
        if(status === 'incomplete'){
          count++;
        }
      }
    })
    return count;
  }

  get LastViewed(){
    return this.currentCourses.last_viewed;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCourse(courseID){
    this.currentCourses.last_viewed = courseID;
    window.open(window.location.origin + '/player/' + courseID, '_blank');
  }

  parseJson(string:string) {
    return JSON.parse(string);
  }

}
