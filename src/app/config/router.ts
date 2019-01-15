import { LoginComponent } from "../components/login/login.component";
import { AdminShellComponent } from "../components/admin-shell/admin-shell.component";
import { DashboardTabComponent } from "../components/dashboard-tab/dashboard-tab.component";
import { UsersTabComponent } from "../components/users-tab/users-tab.component";
import { CoursesTabComponent } from "../components/courses-tab/courses-tab.component";
import { ManageTabComponent } from "../components/manage-tab/manage-tab.component";
import { StudentShellComponent } from "../components/student-shell/student-shell.component";
import { StundentCoursesComponent } from "../components/stundent-courses/stundent-courses.component";
import { StundentDashboardComponent } from "../components/stundent-dashboard/stundent-dashboard.component";
import { StundentSettingsComponent } from "../components/stundent-settings/stundent-settings.component";
import { ScormPlayerComponent } from "../components/scorm-player/scorm-player.component";
export const LMSRouter = [{
    path: '',
    component: LoginComponent
},
{
    path: 'admin',
    component: AdminShellComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardTabComponent
        },
        {
            path: 'users',
            component: UsersTabComponent
        },
        {
            path: 'courses',
            component: CoursesTabComponent
        },
        {
            path: 'manage',
            component: ManageTabComponent
        }
    ]
},
{
    path: 'student',
    component: StudentShellComponent,
    children: [
        {
            path: 'dashboard',
            component: StundentDashboardComponent
        },
        {
            path: 'mycourses',
            component: StundentCoursesComponent
        },
        {
            path: 'settings',
            component: StundentSettingsComponent
        },
    ]
},
{
    path: 'player',
    component: ScormPlayerComponent
}
]