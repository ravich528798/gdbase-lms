import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Observable } from 'rxjs/Observable';

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
}

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class UsersTabComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'mobile'];
  dataSource: MatTableDataSource<UserData>;
  totalUsers: any[];
  expandedElement: UserData;
  today: number = Date.now();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) { 
    this.dataSource  = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers().subscribe((data: any[]) => { this.dataSource.data = data;});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getAllUsers = ():Observable<UserData[]> => this.http.get<UserData[]>('server/get_all_users.php');
}
