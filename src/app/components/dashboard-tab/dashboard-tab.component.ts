import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_GET_ALL_USERS, URL_GET_ACTIVE_USERS } from '../../api';

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.scss']
})
export class DashboardTabComponent implements OnInit {

  public totalUsers: Number = 0;
  public activeUsers: Number = 0;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAllUsers().subscribe((data: any[]) => { this.totalUsers = data.length });
    this.getActiveUsers().subscribe((data: any[]) => { this.activeUsers = data.length });
  }

  getAllUsers = () => this.http.get(URL_GET_ALL_USERS);
  getActiveUsers = () => this.http.get(URL_GET_ACTIVE_USERS);
}
