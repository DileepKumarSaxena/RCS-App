import { Component, ViewChild, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { AuthenticationService, UserService } from '@app/_services';
import { ToasterService } from '@app/services/toaster.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent {
  userListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  userData: any;
  moment: any = moment;
  displayedColumns: string[] = ['id', 'bannerWithLogo', 'firstName', 'lastName', 'email', 'phoneNumber', 'userName', 'parentUser', 'botId', 'botToken', 'companyName', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  userId = sessionStorage.getItem('userId')

  constructor(
    private userservice: AddUserService,
    private UserService: UserService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private toasterService: ToasterService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.userReport();
    this.dataSource.paginator = this.paginator;
    this.getUserList();
  }

  get f() { return this.userListForm.controls; }

  userReport() {
    this.userListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    })
  }

  getUserList() {
    this.showLoader = true
    //  userId= sessionStorage.getItem('userId')
    this.ngxService.start();
    this.userservice.getUserReport().subscribe({
      next: (res: any) => {
        this.userData = res;
        this.dataSource.data = this.userData;
        this.paginator.length = res.request_status;
        // this.checkDataSource();
        // this.ngxService.stop();
        this.showLoader = false
      },
      error: (err) => {
        if (err.status === 401) {
          // Log the user out here
          console.log("Unauthorized. Logging out...");
          this.authenticationService.logout();
          window.location.reload();
        } else {
          this.userData = [];
          this.dataSource.data = this.userData;
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
    return `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"
`;
  }

  getBannerUrl(bannerFileName: string): string {
    // Construct and return the URL based on the bannerFileName
    return `/path/to/banners/${bannerFileName}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel() {
    this.showLoader = true
    return this.get_download_Rcs_User_Details_file();
  }

  get_download_Rcs_User_Details_file() {
    this.showLoader = true;
  // userId= sessionStorage.getItem('userId')
    this.ngxService.start();
    this.userservice.getUserReport().subscribe({
      next: (res: any) => {
        this.userData = res;
        this.dataSource.data = this.userData;
        this.paginator.length = res.request_status;
        this.showLoader = false;
      },
      error: (err) => {
        this.userData = [];
        this.dataSource.data = this.userData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();
        this.showLoader = false;
      },
      complete: () => {
        this.downloadUserCSV(); // Call the function to initiate CSV download
      }
    });
  }

  downloadUserCSV() {
    if (this.userData && this.userData.length > 0) {
      const mappedData = this.userData.map((e: any) => ({
        'First Name': e.firstName,
        'Last Name': e.lastName,
        'E-mail': e.email,
        'Phone Number': e.phone,
        'Username': e.userName,
        'Parent User': 'Admin',
        'BotId': e.botId,
        'Bot Token': e.botToken,
        'Company Name': e.companyName,
      }));

      const csv = Papa.unparse(mappedData);
      const csvData = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
      });

      const downloadUrl = window.URL.createObjectURL(csvData);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'User_Report.csv';
      a.click();
    } else {
      Swal.fire({
        title: 'Data Not Found',
        width: '250px',
        icon: 'error',
      });
    }
  }

  editRow(data) {
    this.router.navigate(['/addUser'], { queryParams: { id: data } });

  }

  deleteRow(userId: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this User?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning',
      confirmButtonColor: '#5FC29F',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UserService.deleteUserById(userId).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'User Deleted Successfully',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            }).then(() => {
              this.getUserList();

            });;

          },

          error: (err) => {
            Swal.fire({
              title: 'Error while deleting the User.',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          }
        });
      }
    });
  }

  public decodeBase64ToImage(base64Data: string): string {
    return `data:image/jpeg;base64,${base64Data}`;
  }

  toggleUserStatus(data: any) {
    const newActiveState = data.active === 'Y' ? 'N' : 'Y'; // Toggle the active state

    Swal.fire({
      title: data.active === 'Y' ? 'Are you sure you want to Deactivate this User?' : 'Are you sure you want to Activate this User?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning',
      confirmButtonColor: '#5FC29F',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UserService.activeDeactiveUserById(data.userId, newActiveState).subscribe(
          (res: any) => {
            this.getUserList();
          },
          (err) => {
            // this.toasterService.error(`Error while ${newActiveState === 'Y' ? 'Activating' : 'Deactivating'} the User.`)
            Swal.fire({
              title: `Error while ${newActiveState === 'Y' ? 'Activating' : 'Deactivating'} the User.`,
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          }
        );
      }
    });
  }

}


