import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { LeadService } from 'src/app/services/lead.service';
import moment from 'moment';
import { Location } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent {
  leadForm: FormGroup;
  messageTypes: any = [];
  existingLeadNames: any = [];
  isHidden: any;
  isHidden2: any;
  actionBtn: string = "Submit";
  leadID: any;
  campaignList: any = [];
  leadExecutionData: any = [
    { leadExecutionData: 'save', leadExecutionName: 'Save and Execute' },
    { leadExecutionData: 'schedule', leadExecutionName: 'Save and Schedule' }
  ]
  displayDate: string = 'someValue';
  leadExecutionType: FormControl;
  switchState: boolean = false;
  dnd: boolean = false;
  dupliacteNo: boolean = false;
  selectedFile: any = null;
  numberList: any = [];
  file: File = null;
  minDate:any = moment().format('YYYY-MM-DD');


  constructor(
    private formbuilder: FormBuilder,
    private campaignService: CampaignService,
    private leadService: LeadService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private papa: Papa) {
  }

  ngOnInit(): void {
    this.createLeadForm();
    this.campaignListData();
    this.getRouteParams();
    this.leadExecutionType = this.formbuilder.control('');
  }

  getRouteParams() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res['id']) {
        this.leadID = res['id'];
        this.getLeadInfo();
        this.actionBtn = 'Update';
      }
    })

  }
  getLeadInfo() {
    this.leadService.getLeadData(this.leadID).subscribe({
      next: (res) => {
        this.leadForm.patchValue(res['Lead Info']);
        if (res['Lead Info'].hasOwnProperty("leadSchedule")) {
          this.leadForm.get('leadExecutionType').patchValue('schedule');
          this.leadForm.get('scheduleStartDtm').patchValue(res['Lead Info']['leadSchedule']['scheduleStartDtm']);
          this.leadForm.get('scheduleEndDtm').patchValue(res['Lead Info']['leadSchedule']['scheduleEndDtm']);
        } else {
          this.leadForm.get('leadExecutionType').patchValue('save');
        }
        this.leadForm.controls['leadName'].disable();
      },
      error: (err) => {
        console.log(err, "ERRRRRRR")
      }
    })
  }
  get f() { return this.leadForm.controls; }

  createLeadForm() {
    this.leadForm = this.formbuilder.group({
      userId: [1],
      campaignId: ['', [Validators.required]],
      leadName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      file: [null],
      isDND: [false],
      isDuplicate: [false],
      leadExecutionType: [],
      scheduleStartDtm: [],
      scheduleEndDtm: []
    })
  }

  checkDuplicateName() {
    this.existingLeadNames = [];
    const leadName = this.leadForm.value.leadName;
    this.leadService.getAllTheLeadList(leadName).subscribe({
      next: (res) => {
        if (res['message'] == 'Y') {
          this.leadForm.get('leadName').setErrors({ duplicateName: true });
        }
        console.log(res, "Lead Name Created Successfully.");
      },
      error: (err) => {

      }
    });
  }

  campaignListData() {
    this.leadService.getCampaignList().subscribe(res => {
      if (res) {
        this.campaignList = res;
      } else {
        this.leadService.setCampaignList();
      }
    })
  }

  uploadCsvFile(event) {
    this.file = event.target.files[0];
  }
  onSubmit() {
    let data = this.leadForm.value;
    if (this.leadForm.valid) {
      let dndValue = this.leadForm.get('isDND').value;
      let isDuplicateValue = this.leadForm.get('isDuplicate').value;
      data['scheduleStartDtm'] = this.leadForm.value.scheduleStartDtm ? moment(this.leadForm.value.scheduleStartDtm).format('YYYY-MM-DDTHH:mm:ssZ') : null;
      data['scheduleEndDtm'] = this.leadForm.value.scheduleEndDtm ? moment(this.leadForm.value.scheduleEndDtm).format('YYYY-MM-DDTHH:mm:ssZ') : null;
      let formData = this.createLeadData(data);
  
      if (this.leadID) {
        formData['leadId'] = this.leadID;
        this.campaignService.campaignDataUpdate(formData).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Lead Updated Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.leadForm.reset();
              this.router.navigate(['/leadList']);
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'Error while updating the Lead Details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      } else {
        this.leadService.uploadCSVFile(formData, this.file, dndValue, isDuplicateValue).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Lead Created Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.leadForm.reset();
              this.router.navigate(['/leadList']);
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'Error while adding the Lead Details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    }
  }

  createLeadData(dataVal) {
    let obj = {
      "insertDtm": dataVal['scheduleStartDtm'],
      "processDtm": dataVal['scheduleEndDtm'],
      "leadStatus": "Inactive",
      "leadCompletionStatus": "Created",
      "campaignId": dataVal['campaignId'],
      "countOfNumbers": 0,
      "countOfInvalidNumbers": 0,
      "countOfNonRcsNumbers": 0,
      "countOfDuplicateNumbers": 0,
      "countOfBlackListNumbers": 0,
      "userId": dataVal['userId'],
      "leadName": dataVal['leadName'],
      "retryInfo": {
        "retryOnFail": 0,
        "noOfRetry": 0,
        "retryType": "C"
      }
    }

    if (dataVal['leadExecutionType'] == 'schedule') {
      obj["leadSchedule"] = {
        "scheduleStartDtm": dataVal['scheduleStartDtm'],
        "windowRequired": "N",
        "scheduleDay": "6",
        "scheduleEndDtm": dataVal['scheduleEndDtm'],
        "windowStartTime": "10:18",
        "windowEndTime": "21:00"
      }
    } else if(dataVal['leadExecutionType'] == 'save'){
      obj["leadSchedule"] = {
        "scheduleStartDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "windowRequired": "N",
        "scheduleDay": "6",
        "scheduleEndDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "windowStartTime": "10:18",
        "windowEndTime": "21:00"
      }
    }
   return obj;
  }

  goBack(): void {
    this.location.back();
  }

}





