import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  detailData: any;
  moment: any = moment;
  
 
 

  displayedColumns: string[] = ['id', 'created_by', 'created_date', 'last_modified_date', 'lead_id', 'phone_number', 'phone_number_status', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
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
    this.detailReport();
    this.getdetailList();
  }


  get f() { return this.detailListForm.controls; }

  detailReport() {
    this.detailListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    })
  }
  getdetailList() {
    this.showLoader=true
    let username = 'Admin';
    let startDateVal = moment(this.detailListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.detailListForm.value.endDate).format('YYYY-MM-DD');
    this.ngxService.start();
    this.reportservice.getDeatilReport(username, startDateVal, endDateVal).subscribe({
      next: (res: any) => {
       
        this.detailData = res.data;
        this.dataSource.data = this.detailData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  editRow(data) {
    this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });

        this.showLoader = false
      }
    });
  }
  editRow(data) {
    this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }

  //For Downloading the table data same as it is showing in UI....

  exportToExcel() {
    const data: any[] = this.dataSource.filteredData.map(item => {
      // Map the table data to include only the necessary columns
      return {
        'Created By': item.created_by,
        'Created Date': item.created_date,
        'Last Modified Date': item.last_modified_date,
        'Phone Number': item.phone_number,
        'Phone Number Status': item.phone_number_status,
        'Status': item.status
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName: string = 'Detail_Report.xlsx';
    const excelBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, fileName);
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
