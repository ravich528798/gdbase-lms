import {Component,OnInit, Inject} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {URL_GET_USER} from 'src/app/api';
import {HttpClient} from '@angular/common/http';
import { WindowWrapper } from 'src/app/directives/WindowWrapper';

@Component({
  selector: 'app-scorm-player',
  templateUrl: './scorm-player.component.html',
  styleUrls: ['./scorm-player.component.scss']
})
export class ScormPlayerComponent implements OnInit {
  public userData: any;
  public coursesData: any;

  private courseID:string = '201810291054555bd6d8ef0235a';
  private launchPath:string = `courses/quiz/index_lms_html5.html`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject(WindowWrapper) private win:Window
  ) {}

  ngOnInit(){
    this.win['getUser'] = this.getUser;
    this.win['GLMSCommit'] = this.GLMSCommit;

    this.getUser().subscribe(res => {
      this.userData = res[0];
      this.win['Utils'].launchSCO({
        path: this.launchPath,
        studentData: this.userData,
        courseID: this.courseID
      });
    })
  }

  getUser = (): Observable < any > => this.http.post < any > (URL_GET_USER, {
    action: 'username',
    payload: localStorage.getItem('gdbaseLMSToken').split("|")[0]
  });

  GLMSCommit = (msg,msgType) => {
    console.log(msg, msgType, this.win['API'].cmi);
  }

  buildCourseData(courses_data){
    if(!courses_data){
      courses_data[this.courseID] = {
        cmi: this.win['API'].cmi,
        logs:{
          entries:{

          },
          errors:{

          }
        }
      }
    }
    
  }
}