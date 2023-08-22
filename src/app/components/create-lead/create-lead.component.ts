import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  testLeadForm: FormGroup;
  messageTypes: any = [];
  existingLeadNames: any = [];
  isHidden: any;
  isHidden2: any;
  isHidden3: any;
  actionBtn: string = "Submit";
  leadID: any;
  campaignId: any;
  campaignList: any = [];
  templateDetailList: any = [];
  testLeadDynamicFields: FormArray;
  templateCustomParamArray: any = [];
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
  file: File;
  minDate: string = moment().format('YYYY-MM-DDTHH:mm');
  allowedFileExtensions = ['csv'];
  uploadProgress: number = 0;
  public showLoader = false;
  // testLeadFieldsFilled = false;
  phoneNumError: boolean;
  showClickOfSubmitButton = false;


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
      userId: sessionStorage.getItem('userId'),
      campaignId: ['', [Validators.required]],
      leadName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      file: [null, [Validators.required, this.validateFileFormat()]],
      isDND: [false],
      isDuplicate: [false],
      leadExecutionType: ['save'],
      scheduleStartDtm: [],
      scheduleEndDtm: [],
      startTime: [],
      endTime: [],
      testingNumber: ['', [this.validateNumericInput]],
      testLeadDynamicFields: new FormArray([])
    })
  }
  // getGuideline() {
  //   this.guidelines = this.data.tabObj[0];
  //   console.log(this.guidelines);
  //   this.form = this.createGroup();
  // }

  // createGroup() {
  //   const group = this.fb.group({});
  //   this.leadForm.fields.forEach(control => group.addControl(control.field_name, this.fb.control('')));

  //   return group;
  // }

  createItem(): FormGroup {
    return this.formbuilder.group({
      key: [''],
      value: [''],
    });
  }

  addRow() {
    this.testLeadDynamicFields = this.leadForm.get('testLeadDynamicFields') as FormArray;
    if (this.testLeadDynamicFields.value.length < 10) {
      this.testLeadDynamicFields.push(this.createItem());
    }
  }

  removeRow(index: number) {
    this.testLeadDynamicFields = this.leadForm.get('testLeadDynamicFields') as FormArray;
    if (index > -1) {
      this.testLeadDynamicFields.removeAt(index);
    }
  }

  validateNumericInput(control) {
    const value = control.value;
    const regex = /^(\d{10})(,\d{10})*$/; // Regular expression to match valid comma-separated numbers with 10 digits each
    if (value && !regex.test(value)) {
      return { invalidNumericInput: true };
    }
    return null;
  }


  getErrorMessage() {
    const testingNumberControl = this.leadForm.get('testingNumber');
    if (testingNumberControl.hasError('required')) {
      return 'You must enter a number.';
    }
    if (testingNumberControl.hasError('invalidNumericInput')) {
      return 'Please enter a valid numeric value with a single comma separated, and each number should be exactly 10 digits.';
    }
    return '';
  }


  uploadCsvFile(event) {
    this.file = event.target.files[0];
    this.leadForm.controls['file'].updateValueAndValidity();
  }


  validateFileFormat() {
    return () => {
      const file = this.file;
      if (file && file.name) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedMimeTypes = ['text/csv'];

        if (fileExtension !== 'csv' && !allowedMimeTypes.includes(file.type)) {
          console.log('Invalid MIME Type:', file.type);
          return { invalidFileFormat: true };
        }
      }
      return null;
    };
  }

  onLeadNameInputBlur() {
    const leadNameControl = this.leadForm.get('leadName');
    if (leadNameControl.value && leadNameControl.value.trim().length === 0) {
      leadNameControl.setErrors({ spacesNotAllowed: true });
    } else {
      leadNameControl.setErrors(null);
    }
    leadNameControl.updateValueAndValidity();

    // Call the checkDuplicateName() method
    this.checkDuplicateName();
  }



  checkDuplicateName() {
    this.existingLeadNames = [];
    const leadName = this.leadForm.value.leadName;
    this.leadService.getAllTheLeadList(leadName).subscribe({
      next: (res) => {
        if (res['message'] == 'Y') {
          this.leadForm.get('leadName').setErrors({ duplicateName: true });
        }
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


  templateDetails() {
    let selectedCampaignId = this.leadForm.get('campaignId').value;
    this.leadService.getTemplateDetailsByCampaignId(selectedCampaignId).subscribe(res => {
      if (res) {
        this.templateDetailList = res;
        this.templateCustomParamArray = this.templateDetailList.templateCustomParam.split(',');
        let obj = <FormArray>this.leadForm.get('testLeadDynamicFields')
        this.templateCustomParamArray.forEach(element => {
          obj.push(new FormGroup({ element: new FormControl(null) }))
        })
      }
    });
  }



  areRequiredFieldsFilledForSubmit() {
    if (this.leadForm.get('campaignId').invalid || this.leadForm.get('leadName').invalid || this.leadForm.get('file').invalid) {
      return true;
    } else {
      return false;
    }
  }

  areRequiredFieldsFilledForTestLead() {

    if (this.leadForm.get('campaignId').invalid || this.leadForm.get('leadName').invalid) {
      return true;
    } else {
      return false;
    }
  }

  createTestLead(dataVal) {
    let phoneNumberList = dataVal['testingNumber'].split(',').map(phoneNumber => phoneNumber.trim());
    let val2 = [];
    if (dataVal['testLeadDynamicFields'].length > 0) {
      dataVal['testLeadDynamicFields'].forEach(el => {
        val2.push(el.element);

      })
    }

    let leadInfoDetailsList = phoneNumberList.map(phoneNumber => ({
      "createdDate": new Date(),
      "lastModifiedDate": new Date(),
      "status": "Created",
      "createdBy": sessionStorage.getItem('username'),
      "lastModifiedBy": sessionStorage.getItem('username'),
      "phoneNumber": phoneNumber,
      // "additonalDataInfoText": val1.length > 0 ? val1.toString() : null,
      // "additonalDataInfoText2": val2.length > 0 ? val2.toString() : null,
      "additonalDataInfoText2": val2.length > 0 ? val2.join(',') : null,

    }));

    // Convert the provided strings to JavaScript Date objects
    let scheduleStartDtm = new Date(moment().format('YYYY-MM-DDTHH:mm:ssZ'));
    let scheduleEndDtm = new Date(moment().format('YYYY-MM-DDTHH:mm:ssZ'));

    // Calculate the time difference between start and end dates
    let timeDifference = scheduleEndDtm.getTime() - scheduleStartDtm.getTime();

    // Calculate the number of days between start and end dates
    let numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));



    let obj = {
      "campaignId": dataVal['campaignId'],
      "userId": sessionStorage.getItem('userId'),
      "leadName": dataVal['leadName'],
      "leadSchedule": {
        "scheduleStartDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "windowRequired": "N",
        "scheduleEndDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "scheduleDay": numDays.toString() // Set "scheduleDay" to the number of days between start and end dates
      },
      "leadInfoDetails": leadInfoDetailsList
    };

    return obj;
  }

  validatePhoneNumbers(phoneNumbers: string): boolean {
    // Split the comma-separated phone numbers into an array
    const numbersArray = phoneNumbers.split(',');

    // Define a regular expression pattern for a 10-digit numeric value
    const numericPattern = /^\d{10}$/;

    // Loop through each number and check if it matches the pattern
    for (const number of numbersArray) {
      if (!numericPattern.test(number.trim())) {
        return false; // Invalid phone number found
      }
    }

    return true; // All phone numbers are valid
  }

  testLead() {
    this.showLoader = true;
    this.phoneNumError = false;
    let data = this.leadForm.value;
    this.leadForm.get('file').clearValidators();
    this.leadForm.get('file').updateValueAndValidity();
    if (this.leadForm.valid) {
      let dndValue = this.leadForm.get('isDND').value;
      data['scheduleStartDtm'] = this.leadForm.value.scheduleStartDtm ? moment(this.leadForm.value.scheduleStartDtm).format('YYYY-MM-DDTHH:mm:ssZ') : null;
      data['scheduleEndDtm'] = this.leadForm.value.scheduleEndDtm ? moment(this.leadForm.value.scheduleEndDtm).format('YYYY-MM-DDTHH:mm:ssZ') : null;
      let formData = this.createTestLead(data);

      if (!this.validatePhoneNumbers(data.testingNumber)) {
        this.phoneNumError = true;
        this.showLoader = false; // Don't forget to set the loader to false
        return; // Exit the function if there's a phone number error
      }

      this.leadService.testNumber(dndValue, formData).subscribe({
        next: (res) => {
          this.showLoader = true;
          // this.testLeadFieldsFilled = !this.areRequiredFieldsFilledForTestLead();

          Swal.fire({
            title: 'Lead Tested Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px'
          }).then(() => {
            this.leadForm.reset();
            this.router.navigate(['/leadList']);
          });
        },
        error: () => {
          this.showLoader = false
          Swal.fire({
            title: 'Error',
            text: 'Error while adding the Lead Details.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px'
          });
        },
      })
    }
  }

  onSubmit() {
    this.showLoader = true;
    this.leadForm.get('testingNumber').clearValidators();
    this.leadForm.get('testingNumber').updateValueAndValidity();

    this.leadForm.get('file').updateValueAndValidity();
    if (!this.leadForm.get('file').value) {
      // Set a custom error message for the required validator
      this.leadForm.get('file').setErrors({ required: true });
      this.showLoader = false;
      this.showClickOfSubmitButton = true; // Show the error message
      return;
    }

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
            this.showLoader = false;
            Swal.fire({
              title: 'Lead Updated Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
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
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
            });
          },
        });
      } else {
        this.leadService.uploadCSVFile(formData, this.file, dndValue, isDuplicateValue).subscribe({
          next: (res) => {
            this.showLoader = true
            Swal.fire({
              title: 'Lead Created Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
            }).then(() => {
              this.leadForm.reset();
              this.router.navigate(['/leadList']);
            });
          },
          error: () => {
            this.showLoader = false
            Swal.fire({
              title: 'Error',
              text: 'Error while adding the Lead Details.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px'
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
      "userId": sessionStorage.getItem('userId'),
      "leadName": dataVal['leadName'],
      "retryInfo": {
        "retryOnFail": 0,
        "noOfRetry": 0,
        "retryType": "C"
      }
    }

    // Convert the provided strings to JavaScript Date objects
    let scheduleStartDtm = new Date(dataVal['scheduleStartDtm']);
    let scheduleEndDtm = new Date(dataVal['scheduleEndDtm']);

    // Calculate the time difference between start and end dates
    let timeDifference = scheduleEndDtm.getTime() - scheduleStartDtm.getTime();

    // Calculate the number of days between start and end dates
    let numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (dataVal['leadExecutionType'] == 'schedule') {
      obj["leadSchedule"] = {
        "scheduleStartDtm": dataVal['scheduleStartDtm'],
        "windowRequired": "N",
        "scheduleDay": numDays.toString(),
        "scheduleEndDtm": dataVal['scheduleEndDtm'],
        "windowStartTime": "09:00",
        "windowEndTime": "21:00"
      }
    } else if (dataVal['leadExecutionType'] == 'save') {
      obj["leadSchedule"] = {
        "scheduleStartDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "windowRequired": "N",
        "scheduleDay": numDays.toString(),
        "scheduleEndDtm": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        "windowStartTime": "09:00",
        "windowEndTime": "21:00"
      }
    }
    return obj;
  }

  goBack(): void {
    this.location.back();
  }

  onCancel() {
    window.location.reload();
  }

}