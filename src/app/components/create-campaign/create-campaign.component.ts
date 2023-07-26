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
  cmpId: any;
  
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
      // messageJson: [],
      campaignStartTime: [],
      campaignEndTime: [],
      campaignStatus: ['Active'],
      isDeleted: [0],
      usageType: [0],
      channelPriorityScheme: ['Auto'],
      messageId: 1,
      templateId: [],
      // campSend:[]
     

    })


  }

  checkDuplicateName() {
    this.existingCampaignNames = [];
    const userId = sessionStorage.getItem('userId');
    const campName = this.campaignForm.value.campaignName;
    this.campaignService.getAllTheCampaignList(userId, campName).subscribe({
      next: (res) => {
        console.log("Campaign Created Successfully.");
      },
      error: (err) => {
        let msgVal = err.includes("Campaign Doesn't Exist")
        if (!msgVal) {
          this.campaignForm.get('campaignName').setErrors({ duplicateName: true });
        }
      }
    });
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
    let data = this.campaignForm.value;
    data['campaignStartTime'] = this.campaignForm.value.campaignStartTime ? moment(this.campaignForm.value.campaignStartTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;
    data['campaignEndTime'] = this.campaignForm.value.campaignEndTime ? moment(this.campaignForm.value.campaignEndTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;

    if (this.campaignForm.valid) {
      if (this.cmpId) {
        let formData = this.campaignForm.value;
        formData['campaignId'] = this.cmpId;
        this.campaignService.campaignDataUpdate(this.campaignForm.value).subscribe({
          next: (res) => {
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

