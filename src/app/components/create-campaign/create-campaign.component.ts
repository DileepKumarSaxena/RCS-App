import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CampaignService } from 'src/app/services/campaign.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent {
  campaignForm: FormGroup;
  messageTypes: any = [];
  existingCampaignNames: any = [];
  isHidden: any;
  isHidden2: any;
  actionBtn:string = "Submit";


  constructor(private formbuilder: FormBuilder, private campaignService: CampaignService, private location: Location, private router: Router) {
  }

  onChange(event) {

  }

  ngOnInit(): void {
    this.createCampaignForm();
    this.messageTypeList();
  }
  get f() { return this.campaignForm.controls; }

  createCampaignForm() {
    this.campaignForm = this.formbuilder.group({
      userId: [1],
      campaignName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      description: [],
      textMessage: [],
      campaignStartTime: [],
      campaignEndTime: [],
      messageType: [''],
      campaignStatus: ['Active'],
      isDeleted: [0],
      usageType: [0],
      channelPriorityScheme: ['Auto'],
      messageId: [1],

    })


  }
 
  checkDuplicateName() {
    this.existingCampaignNames = [];
    const userId = 1;
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

  onSubmit() {
    let data = this.campaignForm.value;
    data['campaignStartTime'] = this.campaignForm.value.campaignStartTime ? moment(this.campaignForm.value.campaignStartTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;
    data['campaignEndTime'] = this.campaignForm.value.campaignEndTime ? moment(this.campaignForm.value.campaignEndTime).format('YYYY-MM-DDTHH:mm:ssZ') : null;
    
    if(this.campaignForm.valid) {
      this.campaignService.campaignDataSubmit(this.campaignForm.value).subscribe({
        next: (res) => {
          console.log(res, "Create Form....");
          alert("Campaign Created Successfully.");
          this.campaignForm.reset();
          this.router.navigate(['/campaignList']);
        },
        error: () => {
          alert("Error while adding the Campaign Details.")
        }
      }
      );
    }

  }

  goBack(): void {
    this.location.back();
  }
}

