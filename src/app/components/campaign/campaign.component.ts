import { Component, ElementRef, ViewChild } from '@angular/core';
import { CampaignService } from 'src/app/services/campaign.service';
import Swal from 'sweetalert2';
declare var jQuery: any;
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Router } from '@angular/router'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { Location } from '@angular/common';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  campaignListForm: FormGroup;
  public showLoader = false;
  
  subscription: Subscription = new Subscription();
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  campaignData: any;
  moment: any = moment;
  totalItems: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0]; // Set the default page size
  pageIndex = 0;
  existingCampaignNames: any = [];
  pageTotal:number
  displayedColumns: string[] = ['id', 'createdDate', 'campaignName', 'description', 'templateName', 'actions'];
  dataSource!: MatTableDataSource<any>;
  config: any;
  currentPage: number = 1;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // ngAfterViewInit() {
  //   // Set the initial page index (e.g., 0 for the first page)
  //   this.paginator.pageIndex = 0;

  //   // Load the data for the initial page
  //   this.getCampaignList();
  // }

  onPageChange(event: any) {
    // When the user changes the page, load the data for the new page
    this.getCampaignList();
  }

  constructor(
    private campaignservice: CampaignService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
  ) { 

    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: 0
    };
  }
  pageSizeChange(event): void {
    this.config.itemsPerPage = event.target.value;
    this.config.currentPage = 1;
    this.currentPage = 1;
    this.getCampaignList();
  }

 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex =0;
    this.paginator.pageSize = 5;
    this.createCampaignForm();
    this.getCampaignList();
    
  }


  get f() { return this.campaignListForm.controls; }

  createCampaignForm() {
    this.campaignListForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    })
  }
  getCampaignList() {

    this.showLoader = true;
    // let userId = 1;
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    let startDateVal = moment(this.campaignListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.campaignListForm.value.endDate).format('YYYY-MM-DD');
    this.ngxService.start();
    // const pageIndex = this.paginator.pageIndex;
    // const pageSize = this.paginator.pageSize;


        this.subscription.add(this.campaignservice.getCampaignlistDetails(sessionStorage.getItem('userId'), startDateVal, endDateVal,limit, start, this.paginator.pageIndex, this.paginator.pageSize)
      .subscribe({
       
        next: (res: any) => {
          this.campaignData = res.Campaign;
          this.dataSource.data = this.campaignData;
          this.totalItems = res.campaignData
          this.paginator.length = res.totalCount;
          // this.checkDataSource();
          this.showLoader = false;
          // this.pageIndex = res.campaignData;
        },
        error: (err) => {
          this.campaignData = [];
          this.dataSource.data = this.campaignData;
          console.log(err, "Error while fetching the records.");
          this.showLoader = false;
       
        }
        
      }));
   
  }

  // Replace the onPaginateChange() function with the following:
  // onPaginateChange(event: PageEvent) {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.getCampaignList(); // Trigger fetching the data with the updated pagination settings
  // }
  editRow(data) {
    this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });
  }

  deleteRow(id: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this campaign?',
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
        this.campaignservice.deleteCampaignById(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Campaign Deleted Successfully',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
            this.getCampaignList();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error while deleting the records.',
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

   
  // toggleCampaignStatus(data: any) {
  //   Swal.fire({
  //     title: data.campaignStatus === 'Active' ? 'Are you sure you want to deactivate this campaign?' : 'Are you sure you want to activate this campaign?',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     icon: 'warning',
  //     confirmButtonColor: '#5FC29F',
  //     customClass: {
  //       icon: 'custom-icon-class',
  //     },
  //     width: '300px',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const newActiveState = data.campaignStatus === 'Active' ? 'Inactive' : 'Active'; // Toggle the active state
  
  //       this.campaignservice.campaignDataUpdate({ campaignId: data.campaignId, campaignStatus: newActiveState }).subscribe(
  //         (res: any) => {
  //           console.log(res,"Res....");
  //           this.getCampaignList();
  //         },
  //         (err) => {
  //           Swal.fire({
  //             title: `Error while ${newActiveState === 'Active' ? 'activating' : 'deactivating'} the campaign.`,
  //             customClass: {
  //               icon: 'custom-icon-class',
  //             },
  //             width: '300px',
  //           });
  //         }
  //       );
  //     }
  //   });
  // }
  toggleCampaignStatus(data: any) {
    Swal.fire({
      title: data.isDeleted === 0 ? 'Are you sure you want to deactivate this campaign?' : 'Are you sure you want to activate this campaign?',
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
        const newActiveState = data.isDeleted == 0 ? 'InActive' : 'Active'; // Toggle the active state
        
        this.campaignservice.activeDeactiveCampaignById(data.campaignId, newActiveState).subscribe(
          (res: any) => {
            console.log(res, "Res....");
            this.getCampaignList();
          },
          (err) => {
            Swal.fire({
              title: `Error while ${newActiveState == "Active" ? 'InActive' : 'Active'} the campaign.`,
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


  test(flag){
    return flag == 'Active' ? true : false;
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
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }

  // onPaginateChange(event: PageEvent) {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;
  // }


  downloadFile() {
    this.showLoader = true
    return this.get_download_Rcs_Campaign_Details_file();

  }

  get_download_Rcs_Campaign_Details_file() {
    const startDate = moment(this.campaignListForm.value.startDate).format('YYYY-MM-DD');
    const endDate = moment(this.campaignListForm.value.endDate).format('YYYY-MM-DD');
    if (this.campaignListForm.value.startDate != null && this.campaignListForm.value.endDate != "") {
      return this.campaignservice.getData(startDate, endDate, sessionStorage.getItem('userId')).subscribe(data_ar => {
        if (data_ar.Campaign.length > 0) {
          console.log("Campaign List::=>" + JSON.stringify(data_ar.Campaign))
          this.showLoader = false
          data_ar = data_ar.Campaign.map((e) => {
            // Map only the desired properties with custom header names
            return {
              'Created Date': moment(e.createdDate).format('MM/DD/YYYY'),
              'Campaign Name': e.campaignName,
              'Description': e.description,
              'Template Name': e.templateName
             
              // Add more properties and header names as needed
            };


          });
          console.log("Campaign List::=>" + JSON.stringify(data_ar))

          var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
          var csvData = new Blob(['\uFEFF' + csv], {
            type: 'text/csv;charset=utf-8;'
          });
          var downloadUrl = document.createElement('a');
          downloadUrl.download = 'RCS_Campaign_Detail_Report.csv';
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


  onPageChanged(event: PageEvent) {
    this.getCampaignList();
  }

  

 
}
