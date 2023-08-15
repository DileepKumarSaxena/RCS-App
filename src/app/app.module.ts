import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { LeadComponent } from './components/lead/lead.component';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION,NgxUiLoaderHttpModule  } from 'ngx-ui-loader';
import { TemplateComponent } from './components/template/template.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { HttpConfigInterceptor } from './_interceptors/http-config.interceptor';
// import { HttpErrorInterceptor } from './_interceptors/http-error.interceptor';
import { SpinnerInterceptorService } from './_interceptors/spinner.interceptor';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { NgChartsModule } from 'ng2-charts';


import { FooterComponent } from './components/footer/footer.component';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: 'red',
    bgsPosition: POSITION.bottomCenter,
    bgsSize: 40,
    bgsType: SPINNER.rectangleBounce,
    pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
    pbThickness: 5, // progress bar thickness  
    fgsType: "three-strings",
    //logoUrl: "assets/img/dca_logo1_small.png",
    //logoSize: 30
    };

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
        // OwlDateTimeModule,
        // OwlNativeDateTimeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TextFieldModule,
        MatTableModule,
        MatPaginatorModule,  
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
        MatTabsModule,
        MatTooltipModule,
        NgChartsModule,
        MatAutocompleteModule,
        MatSlideToggleModule
        
        
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
        TemplateComponent,
        LoaderComponent,
        TemplateListComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        DasboardComponent,
        FooterComponent
    
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true },
       
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }