import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constants } from 'src/app/utils/constants';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { URL_UPLOAD_SCORM, URL_VALIDATE_SCORM, URL_CREATE_COURSE, URL_EXTRACT_UPLOADED_SCORM } from 'src/app/api';
import { toMB } from 'src/app/utils/helpers';
import { MatSnackBar } from '@angular/material';
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { WindowWrapper } from 'src/app/directives/WindowWrapper';
import { Resumable, Window, ResumableFile } from 'src/app/utils/interfaces';

interface DropArea {
  nativeElement: HTMLDivElement
}
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
  public scormUploader: Resumable;
  private courseId: string;
  private acceptedFileTypes: string[];
  private uploadReq: any;
  @ViewChild('addCourseFromRoot') addCourseForm: NgForm;
  @ViewChild('dropArea') dropArea: DropArea;
  @ViewChild('photoUpload') courseImgTag: PhotoUploadComponent;

  constructor(
    public snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private http: HttpClient,
    @Inject(WindowWrapper) private window: Window
  ) {
    this.acceptedFileTypes = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed'];
  }

  ngOnInit() {
    this.createFromGroup();
    const lookForDropArea = setInterval(() => {
      if (this.dropArea) {
        clearInterval(lookForDropArea);
        this.initResumableJS();
      }
    })
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

  dragenter(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = true;
    this.uplaodError = "";
  }
  dragleave(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = false;
  }
  dragover(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.insideDropArea = true;
  }

  initResumableJS() {
    const {
      Resumable
    } = this.window;
    this.scormUploader = new Resumable({
      target: URL_UPLOAD_SCORM,
      testChunks: true
    });
    this.scormUploader.assignBrowse(this.dropArea.nativeElement);
    this.scormUploader.assignDrop(this.dropArea.nativeElement);
    this.window['scormUploader'] = this.scormUploader;

    /**
     * Initializing callback events
     */

    // Fires when the file is first added
    this.scormUploader.on('fileAdded', (ResumableFile) => {
      this.uplaodError = null;
      this.insideDropArea = false;
      this.scormUploadStage = 1;
      if (!this.acceptedFileTypes.includes(ResumableFile.file.type)) {
        this.resetScormUploadStage('SCORM file must be zipped before uploading');
      } else {
        this.scormUploader.upload();
      }
    })

    this.scormUploader.on('progress', () => {
      const percentDone = Math.round(this.scormUploader.progress() * 100);
      this.uplaodProgress = percentDone;
      this.uploadedSize = `${Math.round(toMB(this.scormUploader.getSize() * this.scormUploader.progress()))}mb of ${Math.round(toMB(this.scormUploader.getSize()))}mb Uploaded`;
    });

    // Fires while the upload is in progress
    this.scormUploader.on('fileSuccess', (file: ResumableFile, msg: string) => {
      console.log(msg);
      if (msg.split(': ')[0] !== "UPLOADED") {
        this.resetScormUploadStage('Upload Failed unexpectedly. Please try again.');
      } else {
        this.courseId = msg.split(': ')[1];
        setTimeout(() => { this.extractScorm(this.courseId); }, 2000);
      }
    });
  }

  resetScormUploadStage(errMsg?: string) {
    this.scormUploadStage = 0;
    this.uplaodError = errMsg;
    this.insideDropArea = false;
    if (this.scormUploader.files.length > 0) {
      this.scormUploader.files.forEach(file => this.scormUploader.removeFile(file));
    }
    setTimeout(()=>{this.initResumableJS();},2000);
  }

  extractScorm(courseId:string){
    this.http.post(URL_EXTRACT_UPLOADED_SCORM, courseId)
    .subscribe((res:string) => {
      if (res.split(': ')[0] === "EXTRACTED") {
        this.scormUploadStage = 2;
        setTimeout(() => { this.validateScorm(res.split(': ')[1]); }, 2000);
      } else {
        this.resetScormUploadStage(res.toString());
        console.log(res);
      }
    },
    (err:string) => {
      this.resetScormUploadStage(err.toString());
      console.log(err);
      }
    )
  }

  validateScorm(courseId: string) {
    this.http.post(URL_VALIDATE_SCORM, courseId)
      .subscribe(res => {
        if (res === "ValidManifest") {
          this.scormUploadStage = 3;
        } else {
          this.resetScormUploadStage(res.toString());
          console.log(res);
        }
      },
      (err:string) => {
        this.resetScormUploadStage(err.toString());
        console.log(err);
        }
      )
  }

  createCourse() {
    if (this.addCourseFG.valid) {
      if (this.scormUploadStage === 3) {
        let postData = {
          course_id: this.courseId,
          course_name: this.addCourseFG.get('courseTitle').value.replace(/\'/g, "&#39;"),
          course_data: JSON.stringify({
            course_img: this.addCourseFG.get('courseImg').value ? this.addCourseFG.get('courseImg').value : null,
            description: encodeURI(this.addCourseFG.get('courseDesp').value).replace(/\'/g, "&#39;"),
            dateCreated: Date.now(),
            author: this.addCourseFG.get('author').value.replace(/\'/g, "&#39;")
          })
        }
        this.http.post(URL_CREATE_COURSE, postData)
          .subscribe(res => {
            this.openSnackBar('Course published successfully');
            this.addCourseForm.resetForm();
            this.addCourseFG.reset();
            this.courseImgTag.removePicture();
            this.resetScormUploadStage();
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
