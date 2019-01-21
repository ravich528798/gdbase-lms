import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {URL_GET_USER} from 'src/app/api';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-scorm-player',
  templateUrl: './scorm-player.component.html',
  styleUrls: ['./scorm-player.component.scss']
})
export class ScormPlayerComponent implements OnInit {
  public userData: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(){
    this.getUser().subscribe(res => {
      this.userData = res[0];
    })
  }

  getUser = (): Observable < any > => this.http.post < any > (URL_GET_USER, {
    action: 'username',
    payload: localStorage.getItem('gdbaseLMSToken').split("|")[0]
  });
}