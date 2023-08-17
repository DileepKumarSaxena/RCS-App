import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent {
  userListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  userData: any;
  moment: any = moment;
  
 
  displayedColumns: string[] = ['id','bannerWithLogo','firstName', 'lastName', 'email',  'phoneNumber', 'userName', 'parentUser', 'companyName','actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userservice: AddUserService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex =0;
    this.paginator.pageSize = 5;
    this.userReport();
    this.getUserList();
  }


  get f() { return this.userListForm.controls; }

  userReport() {
    this.userListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    })
  }
  getUserList() {
    this.showLoader=true
    let username = sessionStorage.getItem('username');
    let startDateVal = moment(this.userListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.userListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();
    this.userservice.getUserReport(username, startDateVal, endDateVal, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
       
        this.userData = res.data;
        this.dataSource.data = this.userData;
        this.paginator.length = res.request_status;
        // this.checkDataSource();
        // this.ngxService.stop();
        this.showLoader=false
    
      },
      error: (err) => {
        this.userData = [];
        this.dataSource.data = this.userData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();

        this.showLoader=false
      }
    });
  }
  onPageChanged(event: PageEvent) {
    this.getUserList();
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
      title: 'Data Not Found',
      width: '250px'

    });
  }

  goBack(): void {
    this.location.back();
  }

  getLogoUrl(logoFileName: string): string {
    // Construct and return the URL based on the logoFileName
    return `/path/to/logos/${logoFileName}`;
  }

  getBannerUrl(bannerFileName: string): string {
    // Construct and return the URL based on the bannerFileName
    return `/path/to/banners/${bannerFileName}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel(paginatorRef) {
    this.showLoader = true
    return this.get_download_Rcs_User_Details_file(paginatorRef);
  
  }
  
  
  get_download_Rcs_User_Details_file(paginatorRef) {
    this.showLoader = true
    let username = sessionStorage.getItem('username');
    let startDateVal = moment(this.userListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.userListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();
  
    if (this.userListForm.value.fromDate !== '' && this.userListForm.value.toDate !== '') {
      return this.userservice.downloaduserlist(username, startDateVal, endDateVal).subscribe((data_ar: any) => {
        if (data_ar.data.length > 0) {
          this.showLoader = false
          data_ar = data_ar.data.map((e, i) => {
  
            const startingSerialNo = paginatorRef.pageIndex * paginatorRef.pageSize + 1;
            // Map only the desired properties with custom header names
            return {
             
              'First Name': e.firstName,
              'Last Name': e.lastName,
              'E-mail': e.email,
              'Phone Number': e.phoneNumber,
              'Username': e.userName,
              'Parent User': e.parentUser,
              'Company Name': e.companyName,
           
            };
  
  
          });
  
          var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
          var csvData = new Blob(['\uFEFF' + csv], {
            type: 'text/csv;charset=utf-8;'
          });
          var downloadUrl = document.createElement('a');
          downloadUrl.download = 'RCS_User_Report.csv';
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


  editRow(data) {
    this.router.navigate(['/addUser'], { queryParams: { id: data } });
  }


  
}


