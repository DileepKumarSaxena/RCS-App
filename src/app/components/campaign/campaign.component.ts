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


  displayedColumns: string[] = ['userId', 'campaignName', 'description', 'textMessage', 'campaignStartTime', 'campaignEndTime', 'messageType', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private campaignservice: CampaignService) {

  }
  ngOnInit(): void {
    this.getCampaignList();

  }

  
  getCampaignList() {
    this.campaignservice.getCampaignlistDetails().subscribe({
      next: (res: any) => { // Type assertion to any[]
        console.log(res, "RRREEESSS");
        const campaignData = res.Campaign; // Access the 'Campaign' property
        this.dataSource = new MatTableDataSource(campaignData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err, "ERRRROOORRRR");
        alert("Error while fetching the records.");
      }
    });
  }
  
  
  
  
  editRow(data){}
  deleteRow(id: number) {}


}
