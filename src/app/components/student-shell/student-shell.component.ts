import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-shell',
  templateUrl: './student-shell.component.html',
  styleUrls: ['./student-shell.component.scss']
})
export class StudentShellComponent {

  constructor(
    public router: Router
  ) { }
}
