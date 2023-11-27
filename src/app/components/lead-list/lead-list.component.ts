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
import { AddUserService } from '@app/services/add-user.service';
import { AuthenticationService } from '@app/_services';
import { ReportsService } from '@app/services/reports.service';
interface LeadData {
  leadId: string;
  isStartDisabled: boolean;
  isPauseDisabled: boolean;
  isStopDisabled: boolean;
}

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})


export class LeadListComponent {
  public showLoader = false;
  public create_campaign: any[];
  public last_page: number
  public data_ar: any[];
  arrayDataList: any = [];
  config: any;
  totalCount: number = 0;
  currentPage: number = 1;
  leadData: any;
  inputdata: any;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  leadForm: FormGroup;
  // campaignList: any;
  moment: any = moment;
  // leadList: LeadData[] = [];
  userId = sessionStorage.getItem('userId');
  campaignList: any = [];
  campaignListArray: any = [];
  leadList: any = [];
  currentDate = new Date();
  userData: any;
  userListbysearch: any;


  displayedColumns: string[] = ['leadId', 'campaignName', 'leadName', 'scheduleStartDtm', 'countOfNumbers','countOfValidNumbers', 'countOfInvalidNumbers', 'countOfDuplicateNumbers', 'countOfBlackListNumbers', 'leadStatus', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private leadService: LeadService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private userservice: AddUserService,
    private authenticationService:AuthenticationService,
    private reportservice: ReportsService,
  ) {}

  ngOnInit(): void {
    this.createCampaignForm();
    this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate()));
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    // this.campaignListData();
    this.getDateFilter();
    // this.getleadfilter();
    this.getLeadList();
    if (this.userId === '1') {
      this.fetchUserList();
    }
  }

  getStatusClass(status: string): string {
    return status === 'Completed' ? 'status-completed' : 'status-acitve';
  }

  get f() { return this.leadForm.controls; }

  createCampaignForm() {
    this.leadForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      campaignId: [],
      leadId: [],
      userName: [],
    });
  }

  campaignListData() {
    this.leadService.getCampaignList().subscribe(res => {
      if (res) {
        this.campaignListArray = res;
      } else {
        this.leadService.setCampaignList();
      }
    })
  }

  getCampaignNameById(campaignId) {
    // console.log(campaignId, "campaignId");
    // console.log(this.campaignList, "campaignList");
    if (this.campaignList && this.campaignList.length > 0) {
      const campaign = this.campaignList.find(el => el.campaignId == campaignId);
      return campaign ? campaign.campaignName : 'N/A'; // Return the campaign name if found, otherwise 'N/A'
    }
  }

  getLeadList() {
    this.showLoader = true
    // let userId = 1;
    let startDateVal = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');
    let userId = this.leadForm.value.userName || sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let campaignId = this.leadForm.value.campaignId;
    let leadId = this.leadForm.value.leadId;
    let userName = this.leadForm.value.userName
    this.leadService.getLeadlistDetails(startDateVal, endDateVal, userId, campaignId, leadId,userName, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
        this.leadData = res['Lead Info'];
        this.dataSource.data = this.leadData;
        this.paginator.length = res.totalCount;
        // this.checkDataSource();
        this.showLoader = false;
      },
      error: (err) => {
        if (err.status === 401) {
          // Log the user out here (e.g., by calling a logout function)
          console.log("Unauthorized. Logging out...");
          this.authenticationService.logout();
          window.location.reload();
        } else {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false
      }}
    });
  }

  getLeadName() {
    let userId = this.leadForm.value.userName || sessionStorage.getItem('userId');
    let selectedCampaignId = this.leadForm.controls.campaignId.value;
    this.leadForm.get('leadId').setValue(null);
    console.log('Selected campaign ID from form:', selectedCampaignId);

    if (selectedCampaignId && userId) {
      this.leadService.getLeadList(userId, selectedCampaignId).subscribe({
        next: (res: any) => {
          if (res) {
            console.log(res, "Lead list fetched successfully.");
            this.leadList = res;
          }
        },
        error: (err) => {
          console.log(err, "Error while fetching the lead list.");
        }
      });
    }
  }

getleadfilter() {
  this.showLoader = true
    let userId = sessionStorage.getItem('userId');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    this.reportservice.dateRangeFilter(from, to, userId).subscribe({
      next: (res: any) => {
        console.log(res, "DDDDDDD222");
        if (res) {
          this.leadList = res;
        }
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
      }
    })
}

  getDateFilter() {
    this.showLoader = true
    let userId = sessionStorage.getItem('userId');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    this.leadService.dateRangeFilter(from, to, userId).subscribe({
      next: (res: any) => {
        console.log(res, "DDDDDDD222");
        if (res) {
          this.campaignList = res;
          this.leadList=res;
        }
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
      }
    })
  }

  checkAndFilter(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value && endDate.value) {
      this.dateFilter(startDate, endDate);
    }
  }

  dateFilter(startDate: HTMLInputElement, endDate: HTMLInputElement, selectedUserId?: string) {
    if (startDate.value && endDate.value) {
      // this.showLoader = true
      let userId = this.leadForm.value.userName || sessionStorage.getItem('userId');
      let from = moment(startDate.value).format('YYYY-MM-DD');
      let to = moment(endDate.value).format('YYYY-MM-DD');
      this.leadForm.get('campaignId').setValue(null);
      this.leadForm.get('leadId').setValue(null);
      this.leadService.dateRangeFilter(from, to, userId).subscribe({
        next: (res: any) => {
          this.campaignList = res;
          this.leadList = res;
          this.showLoader = false;
        },
        error: (err) => {
          console.log(err, "Error while fetching the records.");
        }
      });
    }
  }
  

  userFilter(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value && endDate.value) {
      // this.showLoader = true
      let userId = this.leadForm.value.userName;
      let from = moment(startDate.value).format('YYYY-MM-DD');
      let to = moment(endDate.value).format('YYYY-MM-DD');
      this.leadForm.get('campaignId').setValue(null);
      this.leadForm.get('leadId').setValue(null);
      this.leadService.dateRangeFilter(from, to, userId).subscribe({
        next: (res: any) => {
          this.campaignList = res;
          this.showLoader = false
        },
        error: (err) => {
          console.log(err, "Error while fetching the records.");
        }
      })
    }
  }

  onPageChanged(event: PageEvent) {
    this.getLeadList();
  }
  showEnableDisabled(data: any) {
    if (data.leadStatus == 'Completed') {
      return true;
    } else if (data.leadStatus == 'Active') {
      return false;
    } else {
      return true;
    }
  }
  performAction(leadId: string, action: string, data: LeadData) {
    this.showLoader = true;
    
    this.leadService.performActionOnLead(leadId, action).subscribe({
      next: (res: any) => {
        this.updateButtonStates(action, data);
        this.getLeadList();
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
      title: 'No Records Found',
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
let userName = this.leadForm.value.userName
    if (this.leadForm.value.startDate != null && this.leadForm.value.endDate != "") {
      return this.leadService.getLeadListData(sessionStorage.getItem('userId'), startDateVal, endDateVal,userName, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: any) => {
        const leadInfoArray = response['Lead Info']; // Access the 'Lead Info' array

        if (leadInfoArray.length > 0) {
          this.showLoader = false;
          const data_ar = leadInfoArray.map((e) => {
            // Map only the desired properties with custom header names
            return {

              'Lead Id':e.leadId,
              'Campaign Name': e.campaignName,
              'Lead Name': e.leadName,
              'Schedule Date-Time': moment(e.leadSchedule.scheduleStartDtm).format('MM/DD/YYYY   HH:mm'),
              // 'Schedule End Date': moment(e.leadSchedule.scheduleEndDtm).format('MM/DD/YYYY'),
              'Total No.': e.countOfNumbers,
              'Total Valid No.':e.countOfNumbers-e.countOfBlackListNumbers-e.countOfDuplicateNumbers-e.countOfInvalidNumbers-e.countOfNonRcsNumbers,
              'Total Invalid No.': e.countOfInvalidNumbers,
              'Total Duplicate No.': e.countOfDuplicateNumbers,
              'Total BlackList No.': e.countOfBlackListNumbers,
              'Status':e.leadStatus
              // Add more properties and header names as needed
            };
          });


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

  fetchUserList() {
    this.showLoader = true
    this.userservice.getUserReport().subscribe({
      next: (res: any) => {
        this.userListbysearch = res;
        // this.dataSource.data = this.userData;
        this.showLoader = false
        
      },
      error: (err) => {
        this.userData = [];
        this.dataSource.data = this.userData;
        console.log(err, "Error while fetching the records.");
        this.showLoader = false
      }
    });
  }


  getStatusFromCompletionStatus(leadCompletionStatus: string): string {
  
    if (leadCompletionStatus === "Start") {
      return "Active";
    } else if (leadCompletionStatus === "Stop") {
      return "Stop";}
      else if (leadCompletionStatus === "Run Manually") {
        return "Active";
     
    } else if (leadCompletionStatus === "Pause") {
      return "Pause";
    } else {
      
      return leadCompletionStatus;
      
    }

  }

  removeDupliactes(values: any) {
    let concatArray = values.map(eachValue => {
      return Object.values(eachValue).join('')
    })
    let filterValues = values.filter((value, index) => {
      return concatArray.indexOf(concatArray[index]) === index
    })
    return filterValues
  }
  
  getDateFilter2() {
    // this.showLoader = true;
    let userId = this.leadForm.value.userName;
    let startDate = moment(this.leadForm.value.startDate).format('YYYY-MM-DD');
    let endDate = moment(this.leadForm.value.endDate).format('YYYY-MM-DD');


    this.campaignList = [];
    let arrayList = [];
    let arrayList2 = [];
    this.leadList = [];

    this.reportservice.dateRangeFilter(startDate, endDate, userId).subscribe({
      next: (res: any) => {
        if (res) {
          let groups: any = {};
          let obj: any = [];

          res.forEach((element: any) => {
            arrayList.push({ campId: element.campId, campaignName: element.campaignName });

            arrayList2.push({ leadId: element.leadId, leadName: element.leadName });
          })
          this.campaignList = this.removeDupliactes(arrayList);
          this.leadList = arrayList2;
          res.forEach((element: any) => {
            var id = element.campId;

            if (groups[id]) {
              groups[id]['leadInfo'].push({ leadName: element.leadName, leadId: element.leadId });
            } else {
              groups[id] = {};
              groups[id]['leadInfo'] = [];
              groups[id]['leadInfo'].push({ leadName: element.leadName, leadId: element.leadId });
              groups[id]['campId'] = element.campId;
              groups[id]['campaignName'] = element.campaignName;
            }
          });

          Object.keys(groups).forEach(function (key) {
            obj.push(groups[key]);
          });

          this.arrayDataList = obj;
          this.showLoader = false;
        }
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
      }
    })
  }


}





