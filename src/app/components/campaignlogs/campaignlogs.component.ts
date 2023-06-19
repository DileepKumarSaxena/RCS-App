import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { ReportsService } from 'src/app/services/reports.service';


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


  constructor(private http: HttpClient, private detailsReportService: ReportsService) {
  }

  ngOnInit(): void {
    this.detailReportForm = new FormGroup({
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),

    });
  }

  onSubmit() {
    this.showLoader = true;
    this.detailsReportService.detailsReportData(this.detailReportForm.value)
      .subscribe((Response: any) => {
        //if (Response.status == 200) {
        //this.detail_report = Response.data.map((e,i) => {e['index']= i;return e});
        this.detail_report = Response;
        this.showLoader = false
        //}
      })

    // Swal.fire({
    //   title: 'Data is Loading..Please Wait',
    //   width: '290px',
    //   // icon: 'error',
    // });

  }

}



