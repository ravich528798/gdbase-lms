import { LoginComponent } from "../components/login/login.component";
import { AdminShellComponent } from "../components/admin-shell/admin-shell.component";
import { DashboardTabComponent } from "../components/dashboard-tab/dashboard-tab.component";
import { UsersTabComponent } from "../components/users-tab/users-tab.component";
import { CoursesTabComponent } from "../components/courses-tab/courses-tab.component";
import { ManageTabComponent } from "../components/manage-tab/manage-tab.component";
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
}
]