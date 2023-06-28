import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeadService } from 'src/app/services/lead.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import moment from 'moment';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})


export class LeadComponent {

  public showLoader = false;
  public create_campaign: any[];
  public last_page: number
  public data_ar: any[];
  config: any;
  totalCount: number = 0;
  currentPage: number = 1;
  leadData: any;
  inputdata: any;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  leadForm: FormGroup;
  campaignList:any;
  moment: any = moment;

  displayedColumns: string[] = ['leadId','campaignName', 'leadName', 'leadExecutionType', 'scheduleStartDtm', 'scheduleEndDtm', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private leadService: LeadService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService
    ) {

  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.createCampaignForm();
    this.campaignListData();
    this.getLeadList();
    
  }

  get f() { return this.leadForm.controls; }

  createCampaignForm() {
    this.leadForm = this.formbuilder.group({
      startDate: [(moment().startOf('month'))['_d']],
      endDate: [(moment().endOf('month'))['_d']]
    })
  }

  campaignListData() {
    this.leadService.getCampaignList().subscribe(res => {
      if (res) {
        this.campaignList = res;
      } else {
        this.leadService.setCampaignList();
      }
    })
  }
  getCampaignName(id:any){
    let val = this.campaignList.find(el => el.campaignId == id);
    return val['campaignName'];
  }

  getLeadList() {
    let userId = 1;
    let startDateVal = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');
    this.ngxService.start();
    this.leadService.getLeadlistDetails(userId, startDateVal, endDateVal).subscribe({
      next: (res: any) => {
        console.log(res['Lead Info'], "REEEEEE");
        this.leadData = res['Lead Info'];
        this.dataSource.data = this.leadData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.ngxService.stop();
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();
      }
    });
  }
  editRow(data) {
   this.router.navigate(['/lead/edit'], { queryParams: { id: data } });

  }

  deleteRow(id: any) {
    this.leadService.deleteLeadById(id).subscribe({
      next: (res: any) => {
        console.log(res, "Deleted.........");
        alert("Lead Deleted Successfully");
        this.getLeadList();
      },
      error: (err) => {
        console.log(err, "Error while deleting the records.");
      }
    })
  }
}


