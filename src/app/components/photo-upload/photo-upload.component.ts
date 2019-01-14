import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @ViewChild('inputFile') inputFile:any;
  constructor() { }

  ngOnInit() {
  }

  uploadImg(){
    this.inputFile.nativeElement.click();
  }

  onChange(){
    console.log(this);
    const reader = new FileReader();
    reader.onload = function(){
      console.log('file loaded');
    }
    reader.readAsDataURL(this.inputFile.nativeElement.files[0])
  }

}
