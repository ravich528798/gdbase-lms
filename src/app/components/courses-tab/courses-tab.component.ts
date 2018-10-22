import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from 'src/app/utils/constants';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { URL_UPLOAD_SCORM, URL_VALIDATE_SCORM, URL_CREATE_COURSE } from 'src/app/api';

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
  private courseId: string;
  private uploadReq: any;
  @ViewChild('addCourseFromRoot') addCourseFrom;
  @ViewChild('dropArea') dropArea: HTMLDivElement;

  constructor(
    private _fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.createFromGroup();
  }

  createFromGroup() {
    this.addCourseFG = this._fb.group({
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
              break;
            case HttpEventType.DownloadProgress:
              const loaded = Math.round(event.loaded);
              console.log(`Downloading ${loaded} kb downloaded`);
              break;
            case HttpEventType.Response:
              if (event.body.split('-')[0] !== "UPLOADED") {
                event.body == 'NOT_A_ZIP' ? this.uplaodError = 'SCORM file must be zipped before uploading' : '';
                this.scormUploadStage = 0;
                console.log(event.body);
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
          course_name: this.addCourseFG.get('courseTitle').value,
          course_data: {
            description: this.addCourseFG.get('courseDesp').value.replace(/\"/g, '\\\\"'),
            dateCreated: Date.now(),
            author: this.addCourseFG.get('author').value
          }
        }
        this.http.post(URL_CREATE_COURSE, postData)
          .subscribe(res => {
            console.log(res);
          },
            err => {
              alert('Something Went wrong please try again');
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
}
