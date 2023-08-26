import { Routes, RouterModule } from '@angular/router';
import { DetailReportComponent } from './components/detail-report/detail-report.component';
import { SummaryReportComponent } from './components/summary-report/summary-report.component';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { LeadListComponent } from './components/lead-list/lead-list.component';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { BlaclistNumberComponent } from './components/blaclist-number/blaclist-number.component';
import { AddBlaclistNumberComponent } from './components/add-blaclist-number/add-blaclist-number.component';

const routes: Routes = [
    { path: '', component: DasboardComponent, canActivate: [AuthGuard] },
    { path: 'dasboard', component: DasboardComponent, canActivate: [AuthGuard] },
    { path: 'templateList', component: TemplateListComponent, canActivate: [AuthGuard] },
    { path: 'addTemplate', component: AddTemplateComponent, canActivate: [AuthGuard] },
    { path: 'Summary', component: SummaryReportComponent, canActivate: [AuthGuard] },
    { path: 'detailreport', component: DetailReportComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'campaignList', component: CampaignListComponent, canActivate: [AuthGuard] },
    { path: 'campaign/create', component: CreateCampaignComponent, canActivate: [AuthGuard] },
    { path: 'campaign/edit', component: CreateCampaignComponent, canActivate: [AuthGuard] },
    { path: 'leadList', component: LeadListComponent, canActivate: [AuthGuard] },
    { path: 'lead/create', component: CreateLeadComponent, canActivate: [AuthGuard] },
    { path: 'lead/edit', component: CreateLeadComponent, canActivate: [AuthGuard] },
    { path: 'reset/password', component: ResetPasswordComponent, canActivate: [AuthGuard] },
    { path: 'forgot/password', component: ForgotPasswordComponent },
    { path: 'user/list', component: UserRegistrationComponent, canActivate: [AuthGuard] },
    { path: 'addUser', component: AddUserComponent, canActivate: [AuthGuard] },
    { path: 'blacklist', component: BlaclistNumberComponent, canActivate: [AuthGuard] },
    { path: 'addBlacklist', component: AddBlaclistNumberComponent, canActivate: [AuthGuard] },


    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];

export const appRoutingModule = RouterModule.forRoot(routes);