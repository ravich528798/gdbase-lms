export interface CurrentUser {
  studentID: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  usertype: string;
  token: string;
  userdata: string;
  courses_data: string;
}

export interface CourseData {
  course_id: string;
  course_name: string;
  course_data: any;
}

export interface Version {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Children {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface StudentId {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface StudentName {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface LessonLocation {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Credit {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface LessonStatus {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Entry {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Children2 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Raw {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Max {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Min {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Score {
  _children: Children2;
  raw: Raw;
  max: Max;
  min: Min;
}

export interface TotalTime {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface LessonMode {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Exit {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface SessionTime {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Core {
  _children: Children;
  student_id: StudentId;
  student_name: StudentName;
  lesson_location: LessonLocation;
  credit: Credit;
  lesson_status: LessonStatus;
  entry: Entry;
  score: Score;
  total_time: TotalTime;
  lesson_mode: LessonMode;
  exit: Exit;
  session_time: SessionTime;
}

export interface SuspendData {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface LaunchData {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Comments {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface CommentsFromLms {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Children3 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Count {
  cminame: string;
  cmivalue: number;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Objectives {
  _children: Children3;
  _count: Count;
  objArr: any[];
}

export interface Children4 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface MasteryScore {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface MaxTimeAllowed {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface TimeLimitAction {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface StudentData {
  _children: Children4;
  mastery_score: MasteryScore;
  max_time_allowed: MaxTimeAllowed;
  time_limit_action: TimeLimitAction;
}

export interface Children5 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Audio {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Language {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Speed {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Text {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface StudentPreference {
  _children: Children5;
  audio: Audio;
  language: Language;
  speed: Speed;
  text: Text;
}

export interface Children6 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Count2 {
  cminame: string;
  cmivalue: number;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Id {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Count3 {
  cminame: string;
  cmivalue: number;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Id2 {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface ObjectivesInteractionArr {
  id: Id2;
}

export interface Objectives2 {
  _count: Count3;
  objectivesInteractionArr: ObjectivesInteractionArr[];
}

export interface Time {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Type {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Count4 {
  cminame: string;
  cmivalue: number;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Pattern {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface CorrectResponsesInteractionArr {
  pattern: Pattern;
}

export interface CorrectResponses {
  _count: Count4;
  correctResponsesInteractionArr: CorrectResponsesInteractionArr[];
}

export interface Weighting {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface StudentResponse {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Result {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface Latency {
  cminame: string;
  cmivalue: string;
  cmireadStatus: string;
  cmidatatype: string;
}

export interface IntArr {
  id: Id;
  objectives: Objectives2;
  time: Time;
  type: Type;
  correct_responses: CorrectResponses;
  weighting: Weighting;
  student_response: StudentResponse;
  result: Result;
  latency: Latency;
}

export interface Interactions {
  _children: Children6;
  _count: Count2;
  intArr: IntArr[];
}

export interface Cmi {
  _version: Version;
  core: Core;
  suspend_data: SuspendData;
  launch_data: LaunchData;
  comments: Comments;
  comments_from_lms: CommentsFromLms;
  objectives: Objectives;
  student_data: StudentData;
  student_preference: StudentPreference;
  interactions: Interactions;
}

export interface Logs {
  entries: any;
  errors: any;
}

export interface SCORM_Data {
  cmi: Cmi;
  logs: Logs;
}

export interface StudentCoursesData {
  [key: string]: SCORM_Data;
}

export interface Resumable {
  addFile(file: File, event: Event): void;
  addFiles(files: File[], event: Event): void;
  assignBrowse(domNodes: HTMLElement, isDirectory?: boolean): void;
  assignDrop(domNodes: HTMLElement | HTMLElement[]): void;
  cancel(): void;
  defaults: ResumableDefaults;
  events: [];
  files: ResumableFile[];
  fire(): void;
  getFromUniqueIdentifier(uniqueIdentifier): void;
  getOpt(o: any): void;
  getSize(): number;
  handleChangeEvent(e: Event): void;
  handleDropEvent(e: Event): void;
  isUploading(): void;
  on(event: string, callback: (file:ResumableFile, event:Event | string) => void): void;
  opts: opts;
  pause(): void;
  progress(): number;
  removeFile(file: ResumableFile): void;
  support: true;
  unAssignDrop(domNodes: HTMLElement): void;
  updateQuery(query: any): void;
  upload(): void;
  uploadNextChunk(): void;
  version: number;
}

export interface ResumableFile{
    abort():void;
    bootstrap():void;
    cancel():void;
    chunks: ResumableChunk[];
    container: HTMLElement;
    file: File;
    fileName: string;
    getOpt(o:string):opts;
    isComplete():boolean;
    isPaused():boolean;
    isUploading():boolean;
    opts: opts;
    pause(pause:boolean):void;
    progress():number;
    relativePath: string;
    resumableObj: Resumable;
    retry():void;
    size: number;
    uniqueIdentifier: string;
    _pause: boolean;
    _prevProgress: number;
}

interface ResumableChunk {
    abort():void;
    callback():void;
    endByte: number;
    fileObj: ResumableFile
    fileObjSize: number;
    fileObjType: string;
    getOpt(o:string):opts;
    lastProgressCallback: Date;
    loaded: number;
    message():string;
    offset:number;
    opts: opts;
    pendingRetry: boolean;
    preprocessFinished(): void;
    preprocessState: 0;
    progress(relative:number):void;
    resumableObj: Resumable;
    retries: number;
    send(): void;
    startByte: number;
    status(): void;
    test(): void;
    tested: boolean;
    xhr: null;
}

interface opts {
  target: string;
  testChunks ? : boolean;
}

interface ResumableDefaults {
  chunkSize: number;
  forceChunkSize: boolean;
  simultaneousUploads: number;
  fileParameterName: string;
  chunkNumberParameterName: string;
  chunkSizeParameterName: string;
  currentChunkSizeParameterName: string;
  totalSizeParameterName: string;
  typeParameterName: string;
  identifierParameterName: string;
  fileNameParameterName: string;
  relativePathParameterName: string;
  totalChunksParameterName: string;
  throttleProgressCallbacks: number;
  query: Query;
  headers: Headers;
  preprocess ? : any;
  method: string;
  uploadMethod: string;
  testMethod: string;
  prioritizeFirstAndLastChunk: boolean;
  target: string;
  testTarget ? : any;
  parameterNamespace: string;
  testChunks: boolean;
  generateUniqueIdentifier ? : any;
  getTarget ? : any;
  maxChunkRetries: number;
  permanentErrors: number[];
  withCredentials: boolean;
  xhrTimeout: number;
  clearInput: boolean;
  chunkFormat: string;
  setChunkTypeFromFile: boolean;
  minFileSize: number;
  fileType: any[];
}

interface Query {}

interface Headers {}

export interface Window {
  Resumable(opts: opts): void
}