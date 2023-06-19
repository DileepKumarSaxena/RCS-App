import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeadService } from 'src/app/services/lead.service';
import Swal from 'sweetalert2';
declare var jQuery: any;

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})


export class LeadComponent {
  public showLoader = false;
  loading: boolean = false;
  public create_lead: any[];
  leadForm :FormGroup
  public last_page : number
  public data_ar: any[];
  config: any;
  totalCount: number = 0;
  currentPage: number = 1;
  campaignList: null;
  leadList : null;
  userList:null;
  inputdata: any;
  Start_date: [''];
  End_date: [''];
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;


  constructor(private leadservice:LeadService, private formbuilder:FormBuilder){

  

  this.leadForm = this.formbuilder.group({
    
    Start_date: this.Start_date,
    End_date: this.End_date,
   
  })
}
  pageSizeChange(event): void {
    this.config.itemsPerPage = event.target.value;
    this.config.currentPage = 1;
    this.currentPage = 1;
    //this.baseApiCall();
    
  }
  resetPagination(): void {
    this.config.itemsPerPage = 20;
    this.config.currentPage = 1;
    this.currentPage = 1;
    if (this.paginationCount) {
      this.paginationCount.nativeElement.value = '20';
    }
  }
  campaignChange(event) {
    this.resetPagination();
    this.config.totalItems = 0;
    // this.baseCampaignApi(event);
  }


  getLeadList(id) {
    this.leadservice.getLeadlistDetails(id).subscribe((Response: any) => {
      console.log(Response);
      if (Response.status == 200) {
        this.create_lead = Response.data;
        this.showLoader = false;
        this.create_lead = this.data_ar;
        if (this.create_lead !== null && this.create_lead.length > 0) {
          this.last_page = this.create_lead.length /50;
        }

        (function ($) {
          console.log('Cal=');
          $('.datepicker-here').datepicker({
            autoClose: true,
            onSelect: function (fd) { },
          });
        })(jQuery);

        if (this.create_lead.length == 0) {
        }
        console.log('Data Found!' + this.create_lead.length);
        //console.log(data);
      } else {
        Swal.fire({
          title: 'data Not Found',
        });
      }
    });
  }


  leadChange(event) {
    this.resetPagination();
    this.config.totalItems = 0;
    // this.baseCampaignApi(event);
  }

  userChange(event){

  }


  onDateSelected(event: any) {
 
  }

  onSubmit() {
    const formdata: FormData = new FormData();
    this.loading = !this.loading;
    console.log(this.leadForm);
   
  }

}
