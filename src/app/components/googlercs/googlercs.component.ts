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
@Component({
  selector: 'app-googlercs',
  templateUrl: './googlercs.component.html',
  styleUrls: ['./googlercs.component.scss']
})
export class GooglercsComponent {
  summaryListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  summaryData: any;
  moment: any = moment;
  
 
  displayedColumns: string[] = ['id','campaing_name', 'lead_name', 'created_date', 'last_modified_date', 'status', 'TOTAL',  'SUBMITTED', 'Delivered', 'NonRCS_FAILED',];
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
    this.summaryReport();
    this.getSummaryList();
  }


  get f() { return this.summaryListForm.controls; }

  summaryReport() {
    this.summaryListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    })
  }
  getSummaryList() {
    this.showLoader=true
    let username = 'Admin';
    let startDateVal = moment(this.summaryListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.summaryListForm.value.endDate).format('YYYY-MM-DD');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();
    this.reportservice.getSummaryReport(username, startDateVal, endDateVal, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
       
        this.summaryData = res.data;
        this.dataSource.data = this.summaryData;
        this.paginator.length = res.request_status;
        // this.ngxService.stop();
        this.showLoader=false
    
      },
      error: (err) => {
        this.summaryData = [];
        this.dataSource.data = this.summaryData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();

        this.showLoader=false
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
  goBack(): void {
    this.location.back();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
