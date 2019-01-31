import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constants } from 'src/app/utils/constants';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { URL_UPLOAD_SCORM, URL_VALIDATE_SCORM, URL_CREATE_COURSE } from 'src/app/api';
import { toMB } from 'src/app/utils/helpers';
import { MatSnackBar } from '@angular/material';
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';

@Component({
  selector: 'app-courses-tab',
  templateUrl: './courses-tab.component.html',
  styleUrls: ['./courses-tab.component.scss']
})
export class CoursesTabComponent implements OnInit {
  public addCourseFG: FormGroup;
  public toolbar: any = Constants.editorToolbar;
  public insideDropArea = false;
  public scormUploadStage: number = 0;
  public uplaodProgress: number = 0;
  public uplaodError: string;
  public ScromZIPName: string;
  public uploadedSize: string;
  private courseId: string;
  private uploadReq: any;
  @ViewChild('addCourseFromRoot') addCourseForm: NgForm;
  @ViewChild('dropArea') dropArea: HTMLDivElement;
  @ViewChild('photoUpload') courseImgTag : PhotoUploadComponent;

  constructor(
    public snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.createFromGroup();
  }

  createFromGroup() {
    this.addCourseFG = this._fb.group({
      courseImg: null,
      courseTitle: ['', Validators.required],
      author: ['', Validators.required],
      courseDesp: ['']
    })
  }

  get courseTitle() {
    return this.addCourseFG.get('courseTitle')
  }

  get authorName() {
    return this.addCourseFG.get('author')
  }

  dragenter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = true;
    this.uplaodError = "";
  }
  dragleave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = false;
  }
  dragover(e) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = true;
  }
  drop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = false;
    let dt = e.dataTransfer;
    let files = dt.files;
    if (files.length > 0) {
      let formData = new FormData();
      for (var i = 0, file; file = files[i]; ++i) {
        this.ScromZIPName = file.name;
        formData.append('scormFile', file);
      }
      this.uploadReq = new HttpRequest('POST', URL_UPLOAD_SCORM, formData, {
        reportProgress: true
      })
      this.http.request(this.uploadReq)
        .subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.scormUploadStage = 1;
              break;
            case HttpEventType.ResponseHeader:
              console.log('Headers received ->', event.headers);
              break;
            case HttpEventType.UploadProgress:
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.uplaodProgress = percentDone;
              this.uploadedSize = `${Math.round(toMB(event.loaded))}mb of ${Math.round(toMB(event.total))}mb Uploaded`;
              break;
            case HttpEventType.DownloadProgress:
              console.log(`Downloading ${Math.round(toMB(event.loaded))}MB downloaded`);
              break;
            case HttpEventType.Response:
              console.log(event.body);
              if (event.body.split('-')[0] !== "UPLOADED") {
                event.body == 'NOT_A_ZIP' ? this.uplaodError = 'SCORM file must be zipped before uploading' : '';
                this.scormUploadStage = 0;
              } else {
                this.courseId = event.body.split('-')[1];
                this.scormUploadStage = 2;
                setTimeout(() => { this.validateScorm(this.courseId); }, 2000);
              }
          }
        });
    }
  }

  validateScorm(courseId) {
    this.http.post(URL_VALIDATE_SCORM, courseId)
      .subscribe(res => {
        if (res === "ValidManifest") {
          this.scormUploadStage = 3;
        } else {
          this.scormUploadStage = 0;
          this.uplaodError = res.toString();
          console.log(res);
        }
      })
  }

  createCourse() {
    if (this.addCourseFG.valid) {
      if (this.scormUploadStage === 3) {
        let postData = {
          course_id: this.courseId,
          course_name: this.addCourseFG.get('courseTitle').value.replace(/\'/g,"&#39;"),
          course_data: JSON.stringify({
            course_img: this.addCourseFG.get('courseImg').value ? this.addCourseFG.get('courseImg').value : null,
            description: encodeURI(this.addCourseFG.get('courseDesp').value).replace(/\'/g,"&#39;"),
            dateCreated: Date.now(),
            author: this.addCourseFG.get('author').value.replace(/\'/g,"&#39;")
          })
        }
        this.http.post(URL_CREATE_COURSE, postData)
          .subscribe(res => {
            this.openSnackBar('Course published successfully');
            this.addCourseForm.resetForm();
            this.addCourseFG.reset();
            this.courseImgTag.removePicture();
            this.scormUploadStage = 0;
          },
            err => {
              this.openSnackBar('Something Went wrong please try again');
              console.log(err);
            }
          )
      } else {
        this.uplaodError = "Please upload a SCORM Package";
      }
    } else {
      console.log(this.addCourseFG);
    }
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
