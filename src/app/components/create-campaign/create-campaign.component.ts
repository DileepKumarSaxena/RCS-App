import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CampaignService } from 'src/app/services/campaign.service';
import { TemplateService } from 'src/app/services/template.service'
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent {
  campaignForm: FormGroup;
  messageTypes: any = [];
  allTemplateList: any = [];
  existingCampaignNames: any = [];
  isHidden: any;
  isHidden2: any;
  actionBtn: string = "Submit";
  heading:string = "ADD";
  cmpId: any;
  descriptionPattern = /^[a-zA-Z0-9_]*$/;
  
  selectedOption: any;
  minDate: any = moment().format('YYYY-MM-DD');
  campaignType: any = [
    { campaignType: 'Transactional', campaignName: 'Trans' },
    { campaignType: 'Promotional', campaignName: 'Pro' }
  ]

  campaignSend: any = [
    { campaignSend: 'Static', campaignName: 'Stat' },
    { campaignSend: 'Dynamic', campaignName: 'Dyan' }
  ]
  public showLoader = false;

  campType: FormControl;
  campSend :FormControl;

  constructor(
    private formbuilder: FormBuilder,
    private campaignService: CampaignService,
    private templateService: TemplateService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.createCampaignForm();
    this.messageTypeList();
    this.templateList();
    this.getRouteParams();

    
  }
  getRouteParams() {

    this.activatedRoute.queryParams.subscribe(res => {
      if (res['id']) {
        this.cmpId = res['id'];
        this.getCampaignInfo();
        this.actionBtn = 'Update';
        this.heading = 'UPDATE';
      }
    })

  }
  getCampaignInfo() {
    this.campaignService.getCampaignData(this.cmpId).subscribe({
      next: (res) => {
        console.log(res, "Campaign ID");
        this.campaignForm.patchValue(res);
        this.campaignForm.controls['campaignName'].disable();
      },
      error: (err) => {
        console.log(err, "ERRRRRRR")
      }
    })
  }
  get f() { return this.campaignForm.controls; }

  createCampaignForm() {
    this.campaignForm = this.formbuilder.group({
      userId: sessionStorage.getItem('userId'),
      campaignName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      description: [],
      campaignStartTime: [],
      campaignEndTime: [],
      campaignStatus: ['Active'],
      isDeleted: [0],
      usageType: [0],
      channelPriorityScheme: ['Auto'],
      messageId: 1,
      templateId: [],
     })


  }
 onCampaignNameInputBlur() {
    const campaignNameControl = this.campaignForm.get('campaignName');
    if (campaignNameControl.value && campaignNameControl.value.trim().length === 0) {
      campaignNameControl.setErrors({ spacesNotAllowed: true });
    } else {
      campaignNameControl.setErrors(null);
    }
    campaignNameControl.updateValueAndValidity();

    // Call the checkDuplicateName() method
    this.checkDuplicateName();
  }

  checkDuplicateName() {
    this.existingCampaignNames = [];
    const userId = sessionStorage.getItem('userId');
    const campName = this.campaignForm.value.campaignName;
    this.campaignService.getAllTheCampaignList(userId, campName).subscribe({
      next: (res) => {
        console.log("Campaign Created Successfully.");
        if(res.message.includes('Record Already Exist.')){
          this.campaignForm.get('campaignName').setErrors({ duplicateName: true })
        }
      },
      error: (err) => {
        let msgVal = err.includes("Record Already Exist.")
        if (!msgVal) {
          this.campaignForm.get('campaignName').setErrors({ duplicateName: true });
        }
      }
    });
  }
 
 // Custom method to check if the description is invalid.
 isDescriptionInvalid() {
  const descriptionControl = this.campaignForm.get('description');
  return descriptionControl.invalid && descriptionControl.touched;
}
hasSpecialCharacters(value: string) {
  const pattern = /^[A-Za-z0-9_]+$/;
  return !pattern.test(value);
}
onDescriptionBlur() {
  const descriptionControl = this.campaignForm.get('description');
  if (this.hasSpecialCharacters(descriptionControl.value)) {
      descriptionControl.setErrors({ specialCharacters: true });
  } else {
      descriptionControl.setErrors(null);
  }
}

  messageTypeList() {
    this.campaignService.getMessageList().subscribe(res => {
      if (res) {
        this.messageTypes = res.message;
      } else {
        this.campaignService.setMessageList();
      }
    })
  }
  templateList() {
    this.campaignService.getAllTemplateList().subscribe(res => {
      if (res) {
        console.log(res, "Alllll....");
        this.allTemplateList = res.template;
      } else {
        this.campaignService.setTemplateList();
      }
    })
  }

  onSubmit() {
    this.showLoader=true
    let data = this.campaignForm.value;
    data['campaignStartTime'] = this.campaignForm.value.campaignStartTime ? moment(this.campaignForm.value.campaignStartTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;
    data['campaignEndTime'] = this.campaignForm.value.campaignEndTime ? moment(this.campaignForm.value.campaignEndTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;

    if (this.campaignForm.valid) {
      if (this.cmpId) {
        let formData = this.campaignForm.value;
        formData['campaignId'] = this.cmpId;
        this.campaignService.campaignDataUpdate(this.campaignForm.value).subscribe({
          next: (res) => {
            this.showLoader=false
            console.log(res, "Create Form....");
            Swal.fire({
              title: 'Campaign Updated Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              width: '300px',
            }).then(() => {
              this.campaignForm.reset();
              this.router.navigate(['/campaignList']);
            });
          },
          error: () => {
            this.showLoader=false
            Swal.fire({
              title: 'Error',
              text: 'Error while updating the Campaign Details.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          },
        });
      } else {
        this.campaignService.campaignDataSubmit(this.campaignForm.value).subscribe({
          next: (res) => {
            this.showLoader=true
            console.log(res, "Create Form....");
            Swal.fire({
              title: 'Campaign Created Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            }).then(() => {
              this.campaignForm.reset();
              this.router.navigate(['/campaignList']);
            });
          },
          error: () => {
            this.showLoader=false
            Swal.fire({
              title: 'Error',
              text: 'Error while adding the Campaign Details.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          },
        });
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}

