import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { NavigationComponent } from './components/navigation/navigation.component';
import { XiaomircsComponent } from './components/xiaomircs/xiaomircs.component';
import { GooglercsComponent } from './components/googlercs/googlercs.component';
import { CampaignlogsComponent } from './components/campaignlogs/campaignlogs.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CampaignComponent } from './components/campaign/campaign.component';
import {MatIconModule} from '@angular/material/icon';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { MatInputModule } from '@angular/material/input';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { LeadComponent } from './components/lead/lead.component';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';

@NgModule({
    imports:[
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        NgxMatSelectSearchModule,
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatIconModule,
        MatInputModule,
        OwlNativeDateTimeModule,
        OwlDateTimeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TextFieldModule,
        MatTableModule,
        MatPaginatorModule
        
        
    
    
    ],

    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        NavigationComponent,
        XiaomircsComponent,
        GooglercsComponent,
        CampaignlogsComponent,
        UploadFileComponent,
        CampaignComponent,
        CreateCampaignComponent,
        LeadComponent,
        CreateLeadComponent,
    
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }