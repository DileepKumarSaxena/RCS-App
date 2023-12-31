import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { Alert } from '@app/_models';
=======
>>>>>>> ce3cda90204d41a06156a4e86c6595de7e3c26c0
@Component({
  selector: 'app-googlercs',
  templateUrl: './googlercs.component.html',
  styleUrls: ['./googlercs.component.scss']
})
export class GooglercsComponent {
  summaryListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  summaryData: any;
  moment: any = moment;
<<<<<<< HEAD
  public data_cnt: any[];
=======
>>>>>>> ce3cda90204d41a06156a4e86c6595de7e3c26c0
  
 
  displayedColumns: string[] = ['id','created_date', 'lead_name', 'last_modified_date', 'status', 'TOTAL', 'campaing_name'];
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
    this.summaryReport();
    this.getSummaryList();
  }


  get f() { return this.summaryListForm.controls; }

  summaryReport() {
    this.summaryListForm = this.formbuilder.group({
<<<<<<< HEAD
      startDate:moment().format('YYYY-MM-DD'),
=======
      startDate: moment().format('YYYY-MM-DD'),
>>>>>>> ce3cda90204d41a06156a4e86c6595de7e3c26c0
      endDate: moment().format('YYYY-MM-DD')
    })
  }
  getSummaryList() {
    this.showLoader=true
    let username = 'Admin';
    let startDateVal = moment(this.summaryListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.summaryListForm.value.endDate).format('YYYY-MM-DD');
    this.ngxService.start();
    this.reportservice.getSummaryReport(username, startDateVal, endDateVal).subscribe({
      next: (res: any) => {
<<<<<<< HEAD
      //  this.data_cnt=res.data   //showing table when data is available 
=======
       
>>>>>>> ce3cda90204d41a06156a4e86c6595de7e3c26c0
        this.summaryData = res.data;
        this.dataSource.data = this.summaryData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
