import { Component, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent {
  @ViewChild('inputFile') inputFile: any;
  @Input() form: FormGroup;
  public courseImg: string;
  constructor(
    private snackBar: MatSnackBar
  ) { }

  uploadImg() {
    this.inputFile.nativeElement.click();
  }

  onChange() {
    const reader = new FileReader(), file = this.inputFile.nativeElement.files[0];
    reader.onload = function () {
      this.courseImg = reader.result;
      this.form.controls['courseImg'].setValue(reader.result);
    }.bind(this)
    if (file.type.split('/')[0] == 'image') {
      reader.readAsDataURL(file);
    } else {
      this.openSnackBar(`File format not supported`);
    }
  }

  removePicture(){
    this.courseImg = null;
    this.form.controls['courseImg'].setValue(null);
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
