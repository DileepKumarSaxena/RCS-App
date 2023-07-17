import { Routes, RouterModule } from '@angular/router';
import { CampaignlogsComponent } from './components/campaignlogs/campaignlogs.component';
import { GooglercsComponent } from './components/googlercs/googlercs.component';
import { XiaomircsComponent } from './components/xiaomircs/xiaomircs.component';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { LeadComponent } from './components/lead/lead.component';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { TemplateComponent } from './components/template/template.component';

const routes: Routes = [
    { path: '', component: XiaomircsComponent, canActivate: [AuthGuard] },
    { path: 'vircs', component: XiaomircsComponent, canActivate: [AuthGuard] },
    { path: 'Summary', component: GooglercsComponent, canActivate: [AuthGuard] },
    { path: 'detailreport', component: CampaignlogsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: UploadFileComponent, canActivate: [AuthGuard] },
    { path: 'campaignList', component: CampaignComponent, canActivate: [AuthGuard] },
    { path: 'campaign/create', component: CreateCampaignComponent, canActivate: [AuthGuard] },
    { path: 'campaign/edit', component: CreateCampaignComponent, canActivate: [AuthGuard] },
    { path: 'leadList', component: LeadComponent, canActivate: [AuthGuard] },
    { path: 'lead/create', component: CreateLeadComponent, canActivate: [AuthGuard] },
    { path: 'lead/edit', component: CreateLeadComponent, canActivate: [AuthGuard] },
    // { path: 'template', component: TemplateComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];

export const appRoutingModule = RouterModule.forRoot(routes);