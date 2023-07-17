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
import { Location } from '@angular/common';

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
  campaignList: any;
  moment: any = moment;

  displayedColumns: string[] = ['id','campaignName', 'leadName', 'scheduleStartDtm', 'scheduleEndDtm'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  


  constructor(
    private leadService: LeadService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
  ) {

  }


  ngOnInit(): void {
    this.createCampaignForm();
    this.campaignListData();
    this.getLeadList();
    this.dataSource = new MatTableDataSource<any>();
  }

  

  get f() { return this.leadForm.controls; }

  createCampaignForm() {
    this.leadForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
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
  getCampaignName(id: any) {
    let val = this.campaignList.find(el => el.campaignId == id);
    return val['campaignName'];
  }

  getLeadList() {
    this.showLoader = true
    let userId = 1;
    let startDateVal = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');
    this.leadService.getLeadlistDetails(userId, startDateVal, endDateVal).subscribe({
      next: (res: any) => {
        console.log(res['Lead Info'], "REEEEEE");
        this.leadData = res['Lead Info'];
        this.dataSource.data = this.leadData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showLoader = false;
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false
      }
    });
  }
  editRow(data) {
    this.router.navigate(['/lead/edit'], { queryParams: { id: data } });
  }

  deleteRow(id: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this Lead?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning',
      confirmButtonColor: '#F34335',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.leadService.deleteLeadById(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Lead Deleted Successfully',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
            });
            this.getLeadList();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error while deleting the records.',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
            });
          }
        });
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }
}


