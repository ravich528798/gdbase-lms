import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { URL_GET_ALL_USERS, URL_GET_ACTIVE_USERS, URL_GET_ALL_COURSES } from '../../api';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

interface courseData {
  course_id: string;
  course_name: string;
  course_data: any;
}

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardTabComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'date', 'author','completionRate'];
  public totalUsers: Number = 0;
  public activeUsers: Number = 0;
  public dataSource: MatTableDataSource<courseData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers().subscribe((data: any[]) => { this.totalUsers = data.length });
    this.getActiveUsers().subscribe((data: any[]) => { this.activeUsers = data.length });
    this.getAllCourses().subscribe((data: any[]) => { data.forEach(course => {
      console.log(course);
      course.course_data = JSON.parse(course.course_data);
      this.dataSource.data.push(course);
      console.log(course);
    }) });
  }

  getAllUsers = () => this.http.get(URL_GET_ALL_USERS);
  getActiveUsers = () => this.http.get(URL_GET_ACTIVE_USERS);
  getAllCourses = () => this.http.get(URL_GET_ALL_COURSES);

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
