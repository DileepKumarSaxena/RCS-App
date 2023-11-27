import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplateService } from '@app/services/template.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
import { TemplatePreviewDialogComponent } from './template-preview-dialog/template-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUserService } from '@app/services/add-user.service';
import { AuthenticationService } from '@app/_services/authentication.service';
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent {
  public showLoader = false;
  moment: any = moment;
  templateFilterForm: FormGroup;
  displayedColumns: string[] = ['id', 'inserttime', 'templateCode', 'templateType', 'templateMsgType', 'status'];
  dataSource!: MatTableDataSource<any>;
  templateData: any;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  templateListbysearch: any = [];
  currentDate = new Date();
  selectedTemplate: any;
  userListbysearch: any = [];
  userId = sessionStorage.getItem('userId');
  userData: any;
  constructor(
    private location: Location,
    private templateService: TemplateService,
    private ngxService: NgxUiLoaderService,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private userservice: AddUserService,
    private authenticationService: AuthenticationService) {
  }
  
  ngOnInit(): void {
    this.templateFilters();
    this.dataSource = new MatTableDataSource<any>(this.templateData);
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.getDateFilter();
    this.getTemplateList();

    if (this.userId === '1') {
      this.fetchUserList();
    }
  }

  getStatusClass(status: string): string {
    return status === 'Approved' ? 'status-approved' : 'status-pending';
  }
  templateFilters() {
    this.templateFilterForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      templateName: [],
      templateStatus: [],
      userName: [],
      // templateType: [],
    });
  }
  getTemplateList() {
    this.showLoader = true;
    let templateUserId = sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let startDateVal = moment(this.templateFilterForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.templateFilterForm.value.endDate).format('YYYY-MM-DD');
    let templateName = this.templateFilterForm.value.templateName;
    let templateStatus = this.templateFilterForm.value.templateStatus;
    // let templateType = this.templateFilterForm.value.templateType;
    let userName = this.templateFilterForm.value.userName;
    // this.ngxService.start();
    this.templateService.getTemplatelistDetails(templateUserId, limit, start, startDateVal, endDateVal, templateName, templateStatus,userName, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
        this.templateData = res.template;
        this.dataSource.data = this.templateData;
        // Set the total length of the paginator based on the totalCount property
        this.paginator.length = res.totalCount;
        this.showLoader = false;
      },
      error: (err) => {
        this.templateData = [];
        this.dataSource.data = this.templateData;
        this.showLoader = false;
        console.log(err, "Error while fetching the records.");
      }
    });
  }
  
  getDateFilter() {
    this.showLoader = true
    let templateUserId = sessionStorage.getItem('UserId');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    this.templateService.dateRangeFilter(from, to, templateUserId).subscribe({
      next: (res: any) => {
        this.templateData = res.data;
        this.dataSource.data = this.templateData;
        if (res) {
          this.templateListbysearch = res.template;
        }
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
      }
    })
  }

  getDateFilter2() {
    // this.showLoader = true
    // let templateUserId = sessionStorage.getItem('UserId');
    let templateUserId = this.templateFilterForm.value.userName;
    let from = moment(this.templateFilterForm.value.startDate).format('YYYY-MM-DD');
    let to = moment(this.templateFilterForm.value.endDate).format('YYYY-MM-DD');
    this.templateService.dateRangeFilter2(from, to, templateUserId).subscribe({
      next: (res: any) => {
        this.templateData = res.data;
        this.dataSource.data = this.templateData;
        if (res) {
          this.templateListbysearch = res.template;
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

  dateFilter(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value && endDate.value) {
      // this.showLoader = true
      let templateUserId = sessionStorage.getItem('UserId');
      let from = moment(startDate.value).format('YYYY-MM-DD');
      let to = moment(endDate.value).format('YYYY-MM-DD');
      this.templateFilterForm.get('templateName').setValue(null);
      this.templateFilterForm.get('templateStatus').setValue(null);
      this.templateFilterForm.get('userName').setValue(null);
    
      this.templateService.dateRangeFilter(from, to, templateUserId).subscribe({
        next: (res: any) => {
          this.templateData = res.template;
          // this.dataSource.data = this.templateData;
          if (res) {
            this.templateListbysearch = res.template;
          }
          this.showLoader = false
        },
        error: (err) => {
          console.log(err, "Error while fetching the records.");
        } 
      })
    }
  }

  getTemplateListWithDateFilter() {
    this.showLoader = true;
    let templateUserId = sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let startDateVal = moment(this.templateFilterForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.templateFilterForm.value.endDate).format('YYYY-MM-DD');
    let downloadStatus = this.templateFilterForm.value.downloadStatus;
    let userName = this.templateFilterForm.value.userName;
    let templateName = this.templateFilterForm.value.templateName;
    let templateStatus = this.templateFilterForm.value.templateStatus;

    this.templateService.getTemplateSearchReport(templateUserId, limit, start, startDateVal, endDateVal, downloadStatus, userName, templateName, templateStatus, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
        this.templateData = res.template;
        this.dataSource.data = this.templateData;
        // this.templateTypeFilter();
        this.paginator.length = res.totalCount;
        this.showLoader = false;
      },
      error: (err) => {
        this.templateData = [];
        this.dataSource.data = this.templateData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        // this.ngxService.stop();
        this.showLoader = false;
      }
    });
  }

  fetchUserList() {
    this.showLoader = true;
    this.userservice.getUserReport().subscribe({
      next: (res: any) => {
        this.userListbysearch = res;
        
        // console.log(res,'User_List')
        this.showLoader = false;
      },
      error: (err) => {
        if (err.status === 401) {
         
          console.log("Unauthorized.Logging out...");
          this.authenticationService.logout(); 
          window.location.reload()
        } else {  
          // Handle other errors
          this.userData = [];
          this.dataSource.data = this.userData;
          console.log(err, "Error while fetching the records.");
        }
        this.showLoader = false;
      }   
    });
  }

  // onUserSelected(event: any) {
  //   this.userId = event.userId;
  //   const selectedUser = this.userListbysearch.find(user => user.userId === this.userId);
  //   console.log(this.userId , 'userId')
  //   if (selectedUser) {

  //   }

  // }

  // templateTypeFilter() {
  //   const selectedTemplateType = this.templateFilterForm.value.templateType;
  //     // Check if the selected value is undefined and not "None"
  //   if (selectedTemplateType !== undefined && selectedTemplateType !== 'None') {
  //     // Apply the filter
  //     this.dataSource.filter = selectedTemplateType.trim().toLowerCase();
  //   } else {
  //     // Reset the filter by setting it to null
  //     this.dataSource.filter = null;
  //   }
  // }

  onPageChanged(event: PageEvent) {
    this.getTemplateList();
  }
  editRow(data) { }
  deleteRow(id: any) { }
  previewTemplate(templateData: any) {
    console.log('templateData:', templateData);
    this.selectedTemplate = templateData.templateJson;
    const dialogRef = this.dialog.open(TemplatePreviewDialogComponent, {
      width: '28%',
      data: this.selectedTemplate
    }).afterClosed().subscribe(val => {
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }
  downloadTemplateFile() {
    this.showLoader = true
    return this.get_download_Rcs_Template_Details_file();
  }
  get_download_Rcs_Template_Details_file() {
    this.showLoader = true;
    let templateUserId = sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let startDateVal = moment(this.templateFilterForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.templateFilterForm.value.endDate).format('YYYY-MM-DD');
    let templateName = this.templateFilterForm.value.templateName;
    let templateStatus = this.templateFilterForm.value.templateStatus;
    let userName = this.templateFilterForm.value.userName
    // let templateType = this.templateFilterForm.value.templateType;
    // this.ngxService.start();
    this.templateService.getTemplateData(templateUserId, limit, start, startDateVal, endDateVal, templateName, templateStatus, userName, this.paginator.pageIndex, this.paginator.pageSize).subscribe((data_ar: any) => {
      if (data_ar.template.length > 0) {
        this.showLoader = false
        data_ar = data_ar.template.map((e) => {
          // Map only the desired properties with custom header names
          return {
            'Creation Date': moment(e.inserttime).format('MM/DD/YYYY'),
            'Template Name/Code': e.templateCode,
            'Template Type': e.templateType,
            'Template Message Type': e.templateMsgType,
            'Status': e.status == '0' ? 'Pending' : 'Approved',
            // Add more properties and header names as needed
          };
        });
        var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
        var csvData = new Blob(['\uFEFF' + csv], {
          type: 'text/csv;charset=utf-8;'
        });
        var downloadUrl = document.createElement('a');
        downloadUrl.download = 'RCS_Template_Detail_Report.csv';
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
    //  else {
    //   Swal.fire({
    //     title: 'Please Select the date',
    //     width: '250px',
    //     icon: 'error',
    //   });
    //   this.showLoader = false
    // }
    return null;
  }
}






