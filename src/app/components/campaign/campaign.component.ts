import { Component, ElementRef, ViewChild } from '@angular/core';
import { CampaignService } from 'src/app/services/campaign.service';
import Swal from 'sweetalert2';
declare var jQuery: any;
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  public showLoader = false;
  public create_campaign: any[];
  public last_page: number
  public data_ar: any[];
  config: any;
  totalCount: number = 0;
  currentPage: number = 1;
  campaignList: null;
  inputdata: any;
  @ViewChild('paginationCount', { static: false }) paginationCount: ElementRef;
  campaignForm: FormGroup;
  startDate: Date | null;
  endDate: Date | null;
  campaignData: any;





  displayedColumns: string[] = ['userId', 'campaignName', 'description', 'textMessage', 'campaignStartTime', 'campaignEndTime', 'messageType', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private campaignservice: CampaignService) {

  }
  ngOnInit(): void {
    this.getCampaignList();
    this.dataSource = new MatTableDataSource<any>();

    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.startDate = firstDayOfMonth;
    this.endDate = lastDayOfMonth;
  }


  // getCampaignList() {
  //   this.campaignservice.getCampaignlistDetails().subscribe({
  //     next: (res: any) => { // Type assertion to any[]
  //       const campaignData = res.Campaign; // Access the 'Campaign' property
  //       this.dataSource = new MatTableDataSource(campaignData);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: (err) => {
  //       alert("Error while fetching the records.");
  //     }
  //   });
  // }

  // getCampaignList() {
  //   this.campaignservice.getCampaignlistDetails().subscribe({
  //     next: (res: any) => {
  //       console.log(res, "filteredData");
  //       const campaignData = res.Campaign;

  //       // Apply date range filter
  //       const filteredData = campaignData.filter((row: any) => {
  //         const campaignStartTime = new Date(row.campaignStartTime);
  //         return (
  //           campaignStartTime >= this.startDate && campaignStartTime <= this.endDate ||
  //           campaignStartTime.toDateString() === this.startDate.toDateString() ||
  //           campaignStartTime.toDateString() === this.endDate.toDateString()
  //         );
  //       });


  //       this.dataSource = new MatTableDataSource(filteredData);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: (err) => {
  //       alert("Error while fetching the records.");
  //     }
  //   });
  // }

  getCampaignList() {
    this.campaignservice.getCampaignlistDetails().subscribe({
      next: (res: any) => {
        this.campaignData = res.Campaign;
        this.dataSource.data = this.campaignData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterData();
      },
      error: (err) => {
        alert("Error while fetching the records.");
      }
    });
  }

  filterData() {
    let filteredData = this.campaignData.filter((row: any) => {
      let campaignStartTime = new Date(row.campaignStartTime);
      return campaignStartTime >= this.startDate && campaignStartTime <= this.endDate;
    });

    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  editRow(data) { }
  deleteRow(id: number) { }

}
