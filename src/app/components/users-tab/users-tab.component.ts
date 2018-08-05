import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Observable } from 'rxjs/Observable';

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  username: string;
}

interface ConfirmDeleteDialogData {
  username: string;
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
  currentUser: UserData;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog) { 
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

  deleteUser = (userData) =>{
    this.dataSource.data = this.dataSource.data.filter(el => el.username !== userData.username);
  }

  openDeleteConfirmDialog(): void {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '250px',
      data: {user: this.currentUser, deleteUser: this.deleteUser.bind(this)}
    });

    deleteDialogRef.beforeClose().subscribe(res =>  {
      if(res){
        deleteDialogRef.disableClose = true;
      }
    })
  }

  toggleExpandRow(currrentUser){
    this.currentUser = currrentUser;
  }
}

@Component({
  selector: 'confrim-delete-dialog',
  templateUrl: 'confrim-delete.dialog.html',
})

export class ConfirmDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void{
    data.deleteUser(data.user);
  }

}
