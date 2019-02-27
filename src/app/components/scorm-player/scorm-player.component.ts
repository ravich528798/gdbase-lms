import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { URL_GET_USER, URL_GLMS_COMMIT } from 'src/app/api';
import { HttpClient } from '@angular/common/http';
import { WindowWrapper } from 'src/app/directives/WindowWrapper';

@Component({
  selector: 'app-scorm-player',
  templateUrl: './scorm-player.component.html',
  styleUrls: ['./scorm-player.component.scss']
})
export class ScormPlayerComponent implements OnInit {
  public userData: any;
  public coursesData: any;

  private courseID: string;
  private launchPath: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(WindowWrapper) private win: Window
  ) { }

  ngOnInit() {
    this.win['getUser'] = this.getUser;
    this.win['GLMSCommit'] = this.GLMSCommit;
    this.courseID = this.route.snapshot.paramMap.get('courseId');
    this.launchPath = `${location.origin}/courses/${this.courseID}/index_lms_html5.html`
    this.getUser().subscribe(res => {
      this.userData = res[0];
      this.coursesData = {};
      this.coursesData.last_viewed = this.courseID; 
      if(this.userData.courses_data){
        try{
          this.coursesData =  JSON.parse(this.unescapeSingleQuote(this.userData.courses_data));
          this.coursesData.last_viewed = this.courseID; 
        }
        catch (error){
          console.log(error);
        }
      }
      this.win['GLMSReady'] = true;
      this.win['Utils'].launchSCO({
        path: this.launchPath,
        studentData: this.userData,
        courseID: this.courseID
      });
    })
  }

  getUser = (): Observable<any> => this.http.post<any>(URL_GET_USER, {
    action: 'username',
    payload: localStorage.getItem('gdbaseLMSToken').split("|")[0]
  });

  GLMSCommit = (msg:string, msgType:string) => {
    if (!this.coursesData[this.courseID]) {
      this.coursesData = this.buildCourseData(this.coursesData, this.win['API'].cmi);
    } else {
      this.coursesData[this.courseID].cmi = this.win['API'].cmi;
    }
    this.coursesData = this.addTimePathToLog(this.coursesData, msg, msgType);
    const payload = {
      studentID: this.userData.studentID,
      coursesData: this.escapeSignleQuote(JSON.stringify(this.coursesData))
    }
    this.http.post(URL_GLMS_COMMIT, payload)
      .subscribe(res => {}, err => {console.log(err)});
  }

  buildCourseData(courseData, cmi) {
    courseData[this.courseID] = {
      cmi: cmi,
      logs: {
        entries: {},
        errors: {},
      }
    }
    return courseData;
  }

  escapeSignleQuote(str){
    return str.replace(/\'/g,"\\'");
  }

  unescapeSingleQuote(str){
    return str.replace(/\\'/g,"'");
  }

  addTimePathToLog(data, msg, msgType) {
    const d = new Date(),
      year = d.getFullYear().toString(),
      month = (d.getMonth() + 1).toString(),
      day = d.getDate().toString(),
      time = `${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}_${d.getMilliseconds()}`,
      _msgType = msgType === 'entry' || msgType === 'info' ? 'entries' : 'errors';
    if (!data[this.courseID].logs[_msgType][year]) { // if year NA
      data[this.courseID].logs[_msgType][year] = {};
      data[this.courseID].logs[_msgType][year][month] = {};
      data[this.courseID].logs[_msgType][year][month][day] = {};
      data[this.courseID].logs[_msgType][year][month][day][time] = msg;
      return data;
    } else if (!data[this.courseID].logs[_msgType][year][month]) {// if month NA
      data[this.courseID].logs[_msgType][year][month] = {};
      data[this.courseID].logs[_msgType][year][month][day] = {};
      data[this.courseID].logs[_msgType][year][month][day][time] = msg;
      return data;
    } else if (!data[this.courseID].logs[_msgType][year][month][day]) { // if date NA
      data[this.courseID].logs[_msgType][year][month][day] = {};
      data[this.courseID].logs[_msgType][year][month][day][time] = msg;
      return data;
    } else {
      data[this.courseID].logs[_msgType][year][month][day][time] = msg;
      return data;
    }
  }
}