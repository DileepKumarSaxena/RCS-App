import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { CampaignService } from '@app/services/campaign.service';

@Component({
  selector: 'app-campaignlogs',
  templateUrl: './campaignlogs.component.html',
  styleUrls: ['./campaignlogs.component.scss']
})
export class CampaignlogsComponent {
  detailListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  detailData: any;
  moment: any = moment;
  campaignList: any = [];
  leadList: any = [];
  displayedColumns: string[] = ['id', 'created_by', 'created_date', 'last_modified_date', 'leadname', 'campName', 'language',  'phone_number', 'phone_number_status', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  

  constructor(
    private reportservice: ReportsService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex =0;
    this.paginator.pageSize = 5;
    this.detailReport();
    this.getDetailList();
  }


  get f() { return this.detailListForm.controls; }

  detailReport() {
    this.detailListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      campaignId:[],
      leadId:[],
    })
  }
  dateFilter(startDate: HTMLInputElement, endDate: HTMLInputElement){
    this.showLoader=true
    let userId = sessionStorage.getItem('userId');
    let from = moment(startDate.value).format('YYYY-MM-DD');
    let to = moment(endDate.value).format('YYYY-MM-DD');
    this.reportservice.dateRangeFilter(from, to, userId).subscribe({
      next: (res: any) => {
        console.log(res, "CampaigList");
        this.detailData = res.data;
        this.dataSource.data = this.detailData;
        if (res) {
          this.campaignList = res;
        }
        this.showLoader=false
      },
      error:(err) =>{
        console.log(err, "Error while fetching the records.");
      }
    })
  }

  getLeadName(event:any){
  debugger;
    let userId = sessionStorage.getItem('userId');
    let campaignId = event.source.value;
    this.reportservice.getLeadList(userId, campaignId).subscribe({
      next: (res: any) => {
        console.log(res, "LeadList....")
        if (res) {
          this.leadList = res;
        }
      },
      error:(err) =>{
        console.log(err, "Error while fetching the records.");
      }

    })
  }
  
  getDetailList() {
    debugger;
    this.showLoader=true
    let username = sessionStorage.getItem('username');
    let camType = this.detailListForm.value.campaignId;
    let leadId = this.detailListForm.value.leadId;
    let startDateVal = moment(this.detailListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.detailListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();
    this.reportservice.getDeatilReport(username, startDateVal, endDateVal, camType, leadId, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
       
        this.detailData = res.data;
        this.dataSource.data = this.detailData;
        this.paginator.length = res.request_status;
       
        // this.ngxService.stop();
        this.showLoader=false
    
      },
      error: (err) => {
        this.detailData = [];
        this.dataSource.data = this.detailData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();

        this.showLoader=false
      }
    });
  }
  onPageChanged(event: PageEvent) {
    this.getDetailList();
  }
  editRow(data) {
    this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });

  }

  // deleteRow(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure you want to delete this campaign?',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     icon: 'warning',
  //     confirmButtonColor: '#F34335',
  //     customClass: {
  //       icon: 'custom-icon-class',
  //     },

  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.campaignservice.deleteCampaignById(id).subscribe({
  //         next: (res: any) => {
  //           Swal.fire({
  //             title: 'Campaign Deleted Successfully',
  //           });
  //           this.getdetailList();
  //         },
  //         error: (err) => {
  //           Swal.fire({
  //             title: 'Error while deleting the records.',
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  goBack(): void {
    this.location.back();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
