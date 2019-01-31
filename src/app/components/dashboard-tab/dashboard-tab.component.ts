import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { URL_GET_ALL_USERS, URL_GET_ACTIVE_USERS, URL_GET_ALL_COURSES, URL_COURSES, URL_DELETE_COURSE } from '../../api';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { EnrollUserComponent } from '../enroll-user/enroll-user.component';

interface CourseData {
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
  public displayedColumns: string[] = ['name', 'date', 'author', 'completionRate'];
  public totalUsers: Number = 0;
  public activeUsers: Number = 0;
  public dataSource: MatTableDataSource<CourseData>;
  public currentCourse: CourseData;
  public decodeURI: any;
  public courseURL: string = URL_COURSES;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.decodeURI = decodeURI;
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers().subscribe((data: any[]) => { this.totalUsers = data.length });
    this.getActiveUsers().subscribe((data: any[]) => { this.activeUsers = data.length });
    this.getAllCourses().subscribe((data: any[]) => { this.dataSource.data = this.parseData(data) });
  }

  parseData(data) {
    const parsedData = [];
    data.forEach(e => {
      e.course_data = JSON.parse(e.course_data);
      parsedData.push(e);
    })
    return parsedData;
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
  openDeleteConfirmDialog(row): void {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteCourseDialog, {
      width: '30vw',
      data: { course_name: row.course_name, course_id: row.course_id, deleteCourse: this.deleteCourse.bind(this) }
    });

    deleteDialogRef.beforeClose().subscribe(res => {
      if (res) {
        deleteDialogRef.disableClose = true;
      }
    })
  }

  toggleExpandRow(currentCourse) {
    this.currentCourse = currentCourse;
  }

  enrollUser(course) {
    const dialogRef = this.dialog.open(EnrollUserComponent, {
      width: '50vw',
      height: '90vh',
      data: course
    });
  }

  deleteCourse(courseID, courseName){
    this.http.post(URL_DELETE_COURSE, {courseId: courseID})
      .subscribe(
        res => {
          if(res === 'DELETED'){
            this.dataSource.data = this.dataSource.data.filter(course => course.course_id != courseID);
            this.openSnackBar(`Deleted ${courseName}`);
          }else{
            this.openSnackBar(`Something went wrong. Please try again`);
          }
        },
        err => {
          this.openSnackBar(`Something went wrong. Please try again`);
          console.log(err);
        }
      )
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
@Component({
  selector: 'confrim-delete-dialog',
  templateUrl: 'confrim-delete.dialog.html',
})
export class ConfirmDeleteCourseDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CourseData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    data.deleteCourse(data.course_id, data.course_name);
  }

}
