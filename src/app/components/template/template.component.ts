import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '@app/services/campaign.service';
import { Location } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  selected = '';

  templateForm: FormGroup;
  messageTypes: any = [];
  allTemplateList: any = [];
  existingCampaignNames: any = [];
  isHidden: any;
  isHidden2: any;
  actionBtn: string = "Submit";
  cmpId: any;

  selectedOption: any;
  leadExecutionData: any = [
    { leadExecutionData: 'static', leadExecutionName: 'Static' },
    { leadExecutionData: 'Dynamic', leadExecutionName: 'Dynamic' }
  ]


  constructor(
    private formbuilder: FormBuilder,
    private campaignService: CampaignService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.createtemplateForm();
  
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
        this.templateForm.patchValue(res);
        this.templateForm.controls['campaignName'].disable();
      },
      error: (err) => {
        console.log(err, "ERRRRRRR")
      }
    })
  }
  get f() { return this.templateForm.controls; }

  createtemplateForm() {
    
    this.templateForm = this.formbuilder.group({
      
      templateType:[],
      templateJson:[],
      templateCode:[]
 
      

    })
   


  }




  onSubmit() {
    let data = this.templateForm.value;

    if (this.templateForm.valid) {
      if (this.cmpId) {
        let formData = this.templateForm.value;
        formData['campaignId'] = this.cmpId;
        this.campaignService.campaignDataUpdate(this.templateForm.value).subscribe({
            next: (res) => {
            console.log(res, "Create Form....");
            alert("Campaign Updated Successfully.");
            this.templateForm.reset();
            this.router.navigate(['/campaignList']);
          },
          error: () => {
            alert("Error while adding the Campaign Details.")
          }
        }
        );
      } else {

        this.campaignService.campaignDataSubmit(this.templateForm.value).subscribe({
          next: (res) => {
            console.log(res, "Create Form....");
            alert("Campaign Created Successfully.");
            this.templateForm.reset();
            this.router.navigate(['/campaignList']);
          },
          error: () => {
            alert("Error while adding the Campaign Details.")
          }
        }
        );
      }
    }


  }

  goBack(): void {
    this.location.back();
  }

}
