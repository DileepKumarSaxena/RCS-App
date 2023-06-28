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

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  campaignListForm: FormGroup;
  // public showLoader = false;
  // public create_campaign: any[];
  // public last_page: number
  // public data_ar: any[];
  // config: any;
  // totalCount: number = 0;
  // currentPage: number = 1;
  // campaignList: null;
  // inputdata: any;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  campaignData: any;
  moment: any = moment;

  displayedColumns: string[] = ['campaignId', 'campaignName', 'description', 'textMessage', 'campaignStartTime', 'campaignEndTime', 'messageType', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private campaignservice: CampaignService,
    private formbuilder: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.createCampaignForm();
    this.getCampaignList();
  }

  get f() { return this.campaignListForm.controls; }

  createCampaignForm() {
    this.campaignListForm = this.formbuilder.group({
      startDate: [(moment().startOf('month'))['_d']],
      endDate: [(moment().endOf('month'))['_d']]
    })
  }
  getCampaignList() {
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
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.ngxService.stop();
      }
    });
  }
  editRow(data) {
    this.router.navigate(['/campaign/edit'], { queryParams: { id: data } });

  }

  deleteRow(id: any) {
    this.campaignservice.deleteCampaignById(id).subscribe({
      next: (res: any) => {
        console.log(res, "Deleted.........");
        alert("Campaign Deleted Successfully");
        this.getCampaignList();
      },
      error: (err) => {
        console.log(err, "Error while deleting the records.");
      }
    })
  }

}
