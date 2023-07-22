import { Component, ElementRef, ViewChild } from '@angular/core';
import { CampaignService } from 'src/app/services/campaign.service';
import Swal from 'sweetalert2';
declare var jQuery: any;
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Router } from '@angular/router'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { Location } from '@angular/common';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  campaignListForm: FormGroup;
  public showLoader = false;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  campaignData: any;
  moment: any = moment;

  displayedColumns: string[] = ['id', 'createdDate', 'campaignName', 'description', 'templateName', 'campaignStatus', 'leadCount', 'usageType', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private campaignservice: CampaignService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
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
    this.showLoader = true
    let userId = 1;
    let startDateVal = moment(this.campaignListForm.value.startDate).format('YYYY-MM-DD');
    let endDateVal = moment(this.campaignListForm.value.endDate).format('YYYY-MM-DD');
    this.ngxService.start();
    this.campaignservice.getCampaignlistDetails(userId, startDateVal, endDateVal).subscribe({
      next: (res: any) => {

        this.campaignData = res.Campaign;
        this.dataSource.data = this.campaignData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.ngxService.stop();
        this.showLoader = false

      },
      error: (err) => {
        this.campaignData = [];
        this.dataSource.data = this.campaignData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();

        this.showLoader = false
        // alert("Something Went Wrong! Please try again.")
      }
    });
  }
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
      confirmButtonColor: '#F34335',
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }
}
