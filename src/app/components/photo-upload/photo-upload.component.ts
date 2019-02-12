import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @ViewChild('inputFile') inputFile: any;
  @Input() form: FormGroup;
  @Input() placeholder: string;
  @Input() formControl: string = 'courseImg';
  @Input() tooltip: string = 'Click to upload course image';
  @Output() updateDP: EventEmitter<string> = new EventEmitter<string>();
  public courseImg: string;
  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.courseImg = this.placeholder;
  }

  uploadImg() {
    this.inputFile.nativeElement.click();
  }

  onChange() {
    const reader = new FileReader(), file = this.inputFile.nativeElement.files[0];
    reader.onload = function () {
      this.courseImg = reader.result;
      this.form.get(this.formControl).setValue(reader.result);
      this.updateDP.emit(reader.result);
    }.bind(this)
    if (file.type.split('/')[0] == 'image') {
      reader.readAsDataURL(file);
    } else {
      this.openSnackBar(`File format not supported`);
    }
  }

  removePicture() {
    this.courseImg = null;
    this.form.get(this.formControl).setValue(null);
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
