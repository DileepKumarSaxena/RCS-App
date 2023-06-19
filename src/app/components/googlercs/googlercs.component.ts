import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-googlercs',
  templateUrl: './googlercs.component.html',
  styleUrls: ['./googlercs.component.scss']
})
export class GooglercsComponent {
  options: boolean = true;
  public summary_report: any[];
  summaryReportForm: FormGroup
  public showLoader = false;

  constructor(private fb: FormBuilder, private summaryReportService: ReportsService) {

  }

  ngOnInit(): void {
    this.summaryReportForm = new FormGroup({
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),

    });
  }


  onSubmit() {
    this.showLoader = true;
    // console.log(this.detailReportForm.value)

    this.summaryReportService.summaryReportData(this.summaryReportForm.value)
      .subscribe((Response: any) => {
        //if (Response.status == 200) {
        //this.detail_report = Response.data.map((e,i) => {e['index']= i;return e});
        this.summary_report = Response;
        this.showLoader = false
        console.log(this.summaryReportForm.value, Response, "Data........")
        //}
      })

    // Swal.fire({
    //   title: 'Data is Loading..Please Wait',
    //   width: '290px',
    //   // icon: 'error',
    // });

  }






  // addElement() {
  //   this.elements.push({});
  // }



}
