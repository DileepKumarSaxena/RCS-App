import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import Swal from 'sweetalert2';
import { AddUserService } from '@app/services/add-user.service';
import { AuthenticationService } from '@app/_services';
@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent {
  summaryListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  summaryData: any;
  moment: any = moment;
  displayedColumns: string[] = ['id', 'Date', 'campaign_name', 'lead_name', 'TOTAL', 'SUBMITTED', 'Delivered', 'failed', 'NonRCS_FAILED', 'Invalid'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  userData: any;
  userListbysearch: any;
  arrayDataList: any = [];
  currentDate = new Date();
  campaignList: any = [];
  leadList: any = [];
  userId = sessionStorage.getItem('userId');

  constructor(
    private reportservice: ReportsService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private userservice: AddUserService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.dateFilter(this.currentDate, this.currentDate, 2);
    this.summaryReport();
    this.getSummaryList();
    if (this.userId === '1') {
      this.fetchUserList();
    }
  }

  get f() { return this.summaryListForm.controls; }

  summaryReport() {
    this.summaryListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      userName: [],
      campaignId: [],
      leadId: [],

    })
  }
  handleDateChange(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    
    if (startDate.value && endDate.value) {
      this.dateFilter(startDate, endDate, 1);
    } else {
      this.summaryListForm.get('campaignId').setValue(null);
      this.summaryListForm.get('leadId').setValue(null);
    }
    
  
  }
  
  
  dateFilter(startDate: any, endDate: any, flag: any) {
    // this.showLoader = true;
    let userId = sessionStorage.getItem('userId');

    let from = flag == '1' ? moment(startDate.value).format('YYYY-MM-DD') : moment(this.currentDate).format('YYYY-MM-DD');
    let to = flag == '1' ? moment(endDate.value).format('YYYY-MM-DD') : moment(this.currentDate).format('YYYY-MM-DD');
    
    this.campaignList = [];
    let arrayList = [];
    let arrayList2 = [];
    this.leadList = [];
  
    this.reportservice.dateRangeFilter(from, to, userId).subscribe({
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

  
  removeDupliactes(values: any) {
    let concatArray = values.map(eachValue => {
      return Object.values(eachValue).join('')
    })
    let filterValues = values.filter((value, index) => {
      return concatArray.indexOf(concatArray[index]) === index
    })
    return filterValues
  }


  getLeadName() {
    this.leadList = [];
    let campaignId = this.summaryListForm.controls.campaignId.value;
    let obj = this.arrayDataList.find(element => element.campId == campaignId);
    this.leadList = obj['leadInfo'];
  }

  getSummaryList() {
    this.showLoader = true
    let userName = this.summaryListForm.value.userName;
    let startDateVal = moment(this.summaryListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.summaryListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let camType = this.summaryListForm.value.campaignId;
    let leadId = this.summaryListForm.value.leadId;
    
    this.ngxService.start();
    this.reportservice.getSummaryReport(userName, startDateVal, endDateVal, limit, start, this.paginator.pageIndex, this.paginator.pageSize,camType,leadId).subscribe({
      next: (res: any) => {

        this.summaryData = res.data;
        this.dataSource.data = this.summaryData;
        this.paginator.length = res.request_status;
        // this.checkDataSource();
        // this.ngxService.stop();
        this.showLoader = false
      },
      error: (err) => {
        if (err.status === 401) {
          // Log the user out here (e.g., by calling a logout function)
          console.log("Unauthorized. Logging out...");
          this.authenticationService.logout();
          window.location.reload();
        } else {
          this.summaryData = [];
          this.dataSource.data = this.summaryData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(err, "Error while fetching the records.");
          this.ngxService.stop();
          this.showLoader = false
        }
      }
    });
  }

  onPageChanged(event: PageEvent) {
    this.getSummaryList();
  }
  // editRow(data) {
  //   this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });

  // }

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
      title: 'Data Not Found',
      width: '250px'
    });
  }

  goBack(): void {
    this.location.back();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel(paginatorRef) {
    this.showLoader = true
    return this.get_download_Rcs_Summary_Details_file(paginatorRef);
  }

  get_download_Rcs_Summary_Details_file(paginatorRef) {
    this.showLoader = true
    let username = this.summaryListForm.value.userName
    let startDateVal = moment(this.summaryListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.summaryListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();

    if (this.summaryListForm.value.fromDate !== '' && this.summaryListForm.value.toDate !== '') {
      return this.reportservice.getSummaryData(username, startDateVal, endDateVal).subscribe((data_ar: any) => {
        if (data_ar.data.length > 0) {
          this.showLoader = false
          data_ar = data_ar.data.map((e, i) => {

            const startingSerialNo = paginatorRef.pageIndex * paginatorRef.pageSize + 1;
            // Map only the desired properties with custom header names
            return {
              'Date': e.created_date,
              'Campaign Name': e.campaing_name,
              'Lead Name': e.lead_name,
              // 'Status': e.status === '0' ? 'Pending' : 'Approved',
              'Total': e.TOTAL,
              'SUBMITTED': e.SUBMITTED,
              'Delivered': e.Delivered,
              'Non RCS FAILED': e.NonRCS_FAILED,
              'Invalid': e.Invalid,
              // Add more properties and header names as needed
            };
          });

          var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
          var csvData = new Blob(['\uFEFF' + csv], {
            type: 'text/csv;charset=utf-8;'
          });
          var downloadUrl = document.createElement('a');
          downloadUrl.download = 'RCS_Summary_Report.csv';
          downloadUrl.href = window.URL.createObjectURL(csvData);
          downloadUrl.click();
          this.showLoader = false
        } else {
          Swal.fire({
            title: 'Data Not Found',
            width: '250px',
            icon: 'error',
          });
        }
        this.showLoader = false
      }, error => {
        console.log(error)
        Swal.fire({
          title: 'Data Not Found',
          width: '250px',
          icon: 'error',
          // position: 'top-end',
        });
      });
    } else {
      Swal.fire({
        title: 'Please Select the date',
        width: '250px',
        icon: 'error',
      });
      this.showLoader = false
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
}
