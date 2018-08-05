import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface loginRes {
  data: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    document.querySelector('video').muted = false;
  }
  public loginHandler() {
    this.http.post('./server/login.php', { username: this.username, password: this.password }).subscribe((data) => {
      if (data !== 'ERROR'){
        this.router.navigateByUrl('/admin/dashboard');
      }
    })
  }
}
