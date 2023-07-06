import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campaignlogs',
  templateUrl: './campaignlogs.component.html',
  styleUrls: ['./campaignlogs.component.scss']
})
export class CampaignlogsComponent {
  public showLoader = false;
  public data_ar: any[];
  public detail_report: any[];
  detailReportForm: FormGroup
  Index: any;
  tableSize = 50;
  tableSizes = [3, 6, 9, 12];
  // public data: any[];


  constructor(private http: HttpClient, private detailsReportService: ReportsService, private location: Location) {
  }

  ngOnInit(): void {
    this.getReportData();
    this.detailReportForm = new FormGroup({
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),

    });
  }
  getReportData(){
    this.detailsReportService.getDetailReports().subscribe({
      next: (res: any) => {
        console.log(res, "res");
        // this.campaignData = res.Campaign;
        // this.dataSource.data = this.campaignData;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.ngxService.stop();
        this.showLoader=false
    
      },
      error: (err) => {
        // this.campaignData = [];
        // this.dataSource.data = this.campaignData;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        console.log(err, "Error while fetching the records.");
        // this.ngxService.stop();

        this.showLoader=false
      }
    });
  }
  onSubmit() {
   
  }
  goBack(): void {
    this.location.back();
  }
}



