import { GLOBALS } from "../utils";

export const Domain = GLOBALS.environment === 'dev'? 'http://localhost/gdbase-lms':'https://training.gdbase.be';

export const URL_API = `${Domain}/server`;

export const URL_LOGIN = `${URL_API}/login.php`;

export const URL_DELETE_USER = `${URL_API}/delete-user.php`;

export const URL_DELETE_COURSE = `${URL_API}/delete-course.php`;

export const URL_GET_ACTIVE_USERS = `${URL_API}/get_active_users.php`;

export const URL_GET_ALL_USERS = `${URL_API}/get_all_users.php`;

export const URL_CHECK_USERNAME_AVAILABILITY = `${URL_API}/username-avalibility.php`;

export const URL_CHECK_EMAIL_AVAILABILITY = `${URL_API}/email-avalibility.php`;

export const URL_ADD_USER = `${URL_API}/add-user.php`;

export const URL_GET_USER = `${URL_API}/get-user.php`;

export const URL_UPDATE_PROFILE = `${URL_API}/update-profile.php`;

export const URL_UPDATE_USER_DATA = `${URL_API}/update-user-data.php`;

export const URL_CHANGE_PASSWORD = `${URL_API}/change-password.php`;

export const URL_SEND_PASSWORD_REST_MAIL = `${URL_API}/password-reset-mail.php`;

export const URL_UPLOAD_SCORM = `${URL_API}/upload-scorm.php`;

export const URL_EXTRACT_UPLOADED_SCORM = `${URL_API}/extract-scorm.php`;

export const URL_VALIDATE_SCORM = `${URL_API}/validate-scorm.php`;

export const URL_CREATE_COURSE = `${URL_API}/create-course.php`;

export const URL_GET_ALL_COURSES = `${URL_API}/get-courses.php`;

export const URL_COURSES = `${Domain}/courses`

export const URL_ENROLL_USERS = `${URL_API}/enrollUsers.php`;

export const URL_GET_ENROLLED_COURSES = `${URL_API}/get-enrolled-courses.php`;

export const URL_GLMS_COMMIT = `${URL_API}/glms-commit.php`;

export const URL_CHECK_PASSWORD = `${URL_API}/check-password.php`;

export const URL_CHANGE_PASSOWRD = `${URL_API}/change-password.php`;


