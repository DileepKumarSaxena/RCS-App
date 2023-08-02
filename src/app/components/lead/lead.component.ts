import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeadService } from 'src/app/services/lead.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import moment from 'moment';
import { Location } from '@angular/common';
import * as Papa from 'papaparse';
interface LeadData {
  leadId: string;
  isStartDisabled: boolean;
  isPauseDisabled: boolean;
  isStopDisabled: boolean;
}

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
  leadList: LeadData[] = [];

  displayedColumns: string[] = ['id','campaignName', 'leadName', 'scheduleStartDtm', 'scheduleEndDtm', 'countOfNumbers', 'countOfInvalidNumbers', 'countOfDuplicateNumbers', 'countOfBlackListNumbers', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
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
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex =0;
    this.paginator.pageSize = 5;
    this.createCampaignForm();
    this.campaignListData();
    this.getLeadList();
   
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
  getCampaignNameById(campaignId) {
    const campaign = this.campaignList.find(el => el.campaignId == campaignId);
    return campaign ? campaign.campaignName : 'N/A'; // Return the campaign name if found, otherwise 'N/A'
  }
 
  
  getLeadList() {
    this.showLoader = true
    // let userId = 1;
    let startDateVal = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.leadService.getLeadlistDetails(sessionStorage.getItem('userId'), startDateVal, endDateVal, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
        console.log(res['Lead Info'], "REEEEEE");
        this.leadData = res['Lead Info'];
        this.dataSource.data = this.leadData;
        this.paginator.length = res.totalCount;
        // this.checkDataSource();
        this.showLoader = false;
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false
      }
    });
  }
  onPageChanged(event: PageEvent) {
    this.getLeadList();
  }

  performAction(leadId: string, action: string, data: LeadData) {
    this.showLoader = true;
  
    this.leadService.performActionOnLead(leadId, action).subscribe({
      next: (res: any) => {
        this.updateButtonStates(action, data);
        this.showLoader = false;
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      },
    });
  }
  
  updateButtonStates(action: string, data: LeadData) {
    // Reset all button states for all items
    this.leadList.forEach((leadData) => {
      leadData.isStartDisabled = false;
      leadData.isPauseDisabled = false;
      leadData.isStopDisabled = false;
    });
  
    // Update the button state for the clicked item
    switch (action) {
      case 'Start':
        data.isStartDisabled = true;
        data.isPauseDisabled = false;
        data.isStopDisabled = false;
        break;
      case 'Pause':
        data.isStartDisabled = false;
        data.isPauseDisabled = true;
        data.isStopDisabled = false;
        break;
      case 'Stop':
        data.isStartDisabled = true;
        data.isPauseDisabled = true;
        data.isStopDisabled = true;
        break;
    }
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

  checkDataSource() {
    this.showLoader = true
    if (this.dataSource['data']['length'] === 0) {
      this.showNoRecordsFoundAlert();
    }

    this.showLoader = false
  }

  showNoRecordsFoundAlert() {
    Swal.fire({
      icon: 'error',
      title: 'No records found',
      width: '250px',
      customClass: {
        icon: 'custom-icon-class',
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

  DownloadLeadFile() {
    this.showLoader = true
    return this.get_download_Rcs_Lead_Details_file();

  }

  get_download_Rcs_Lead_Details_file() {
    let startDateVal = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
  
    if (this.leadForm.value.startDate != null && this.leadForm.value.endDate != "") {
      return this.leadService.getLeadListData(sessionStorage.getItem('userId'), startDateVal, endDateVal, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: any) => {
        const leadInfoArray = response['Lead Info']; // Access the 'Lead Info' array
  
        if (leadInfoArray.length > 0) {
          console.log("Lead List::=>" + JSON.stringify(leadInfoArray));
          this.showLoader = false;
          const data_ar = leadInfoArray.map((e) => {
            // Map only the desired properties with custom header names
            return {

              
              'Campaign Name': this.getCampaignNameById(e.campaignId),
              'Lead Name': e.leadName,
              'Schedule Start Date': moment(e.leadSchedule.scheduleStartDtm).format('MM/DD/YYYY'),
              'Schedule End Date': moment(e.leadSchedule.scheduleEndDtm).format('MM/DD/YYYY'),
              'Total No.': e.countOfNumbers,
              'Total Invalid No.': e.countOfInvalidNumbers,
              'Total Duplicate No.': e.countOfDuplicateNumbers,
              'Total BlackList No.': e.countOfBlackListNumbers,
              // Add more properties and header names as needed
            };
          });
  
          console.log("Lead List::=>" + JSON.stringify(data_ar));
  
          var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
          var csvData = new Blob(['\uFEFF' + csv], {
            type: 'text/csv;charset=utf-8;'
          });
          var downloadUrl = document.createElement('a');
          downloadUrl.download = 'RCS_Lead_Detail_Report.csv';
          downloadUrl.href = window.URL.createObjectURL(csvData);
          downloadUrl.click();
          this.showLoader = false;
        } else {
          Swal.fire({
            title: 'Data Not Found',
            width: '250px',
            icon: 'error',
          });
        }
        this.showLoader = false;
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Data Not Found',
          width: '250px',
          icon: 'error',
        });
      });
    } else {
      Swal.fire({
        title: 'Please Select the date',
        width: '250px',
        icon: 'error',
      });
      this.showLoader = false;
    }
    return null;
  }
}


