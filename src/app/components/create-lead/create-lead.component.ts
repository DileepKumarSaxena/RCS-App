import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent {
 loading: boolean = false;
 CheckdupliacteNo: boolean = false;
  leadForm: FormGroup;
  campaignCreated: boolean = false;
  submitted: boolean;
  campNameErrorCheck: boolean = false;
  description: [''];
  bucket:[''];
  Start_date: [''];
  End_date: [''];
  file: File = null;
  adjustedDate: Date;
  campaignList: null;
  selectedDate: any;
  campaignName: [''];
  textMessage: [''];
  campaignStatus: '';
  isDeleted: '';
  userId: '';
  usageType: '';
  channelPriorityScheme: ''
  messageId: ''
  isHidden = false;
  isHidden2 = false;
  testCampaignBtn: boolean;
  saveOption: number;
  contineuty = false;
  currentDate: FormControl;
  activationDate = this.getNowUTC();
  private getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));

  }



  // currentDate = new Date();
  // nexDate = new Date(this.currentDate.setDate(this.currentDate.getDate()));
  // public setDate = [
  //   new Date(),
  //   new Date(this.nexDate.getFullYear(), this.nexDate.getMonth(), this.nexDate.getDate(), 21, 0)
  // ];
  // startDateVal = new Date();
  // endDateVal = new Date(this.nexDate.getFullYear(), this.nexDate.getMonth(), this.nexDate.getDate(), 21, 0);

  constructor(private formbuilder: FormBuilder, private campaignService: CampaignService) {

    this.leadForm = this.formbuilder.group({
      description: this.description,
      bucket: this.bucket,
      Start_date: this.Start_date,
      End_date: this.End_date,
      campaignName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      campaignStatus: ['Active'],
      textMessage: this.textMessage,
      isDeleted: [0],
      userId: [1],
      usageType: [0],
      channelPriorityScheme: ['Auto'],
      messageId: [1],
      file: this.file,
      CheckdupliacteNo: this.CheckdupliacteNo,
    })
   


    // const d: Date = new Date();
    // let text: string = d.toISOString();
    // document.getElementById("demo")!.innerHTML = text;
    // this.currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
  }

  get g() { return this.leadForm.controls; }
  onChange(event) {

  }

  ngOnInit(): void {
    // moment.tz.setDefault('Asia/Kolkata')

    // this.currentDate = new FormControl(moment().utcOffset('+5:30'));

    // const Start_date = moment().utc().utcOffset('+05:30')
    // this.campaignForm.get('Start_date').setValue(Start_date);
  }


  onDateSelected(event: any) {
    this.selectedDate = event.value;
    const offset = this.selectedDate.getTimezoneOffset() * 60000;     // Convert minutes to milliseconds
    const adjustedTimestamp = this.selectedDate.getTime() - offset;  // Adjust the timestamp
    this.adjustedDate = new Date(adjustedTimestamp);
    const utcString = this.adjustedDate.toISOString();
    //Check the adjusted UTC string in the console
  }


  onSubmit() {
    const formdata: FormData = new FormData();
    this.loading = !this.loading;
    console.log(this.leadForm);
  
        // Swal.fire(
        //   'Campaign Created Successfully !!'
        // )

  }

  get f() { return this.leadForm.controls; }

  submitData() {
    // this.campaignForm;
    console.log(this.leadForm.value)

    this.Start_date = this.leadForm.get('Start_date')?.value;
    this.End_date = this.leadForm.get('End_date')?.value;
    this.textMessage = this.leadForm.get('textMessage')?.value;
    this.description = this.leadForm.get('description')?.value;
    this.campaignName = this.leadForm.get('campaignName')?.value;
    this.campaignStatus = this.leadForm.get('campaignStatus')?.value;
    this.isDeleted = this.leadForm.get('isDeleted')?.value;
    this.userId = this.leadForm.get('userId')?.value;
    this.usageType = this.leadForm.get('usageType')?.value;
    this.channelPriorityScheme = this.leadForm.get('channelPriorityScheme')?.value;
    this.messageId = this.leadForm.get('messageId')?.value
  }

  changeExecution(event) {

  }

  onChangeDate(event) {

  }

  saveData() {

  }

  removeDate() {
    this.leadForm.controls.endDate.setValue('');
  }

  campaignChange(event) {
   
  }

}

  // convertToJson(): void {
  //   try {
  //     const jsonMessage = JSON.parse(this.textMessage);
  //     console.log(jsonMessage);
  //     // You can further process the JSON message as needed
  //   } catch (error) {
  //     console.error('Invalid JSON format:', error);
  //     // Handle the error appropriately, such as showing an error message to the user
  //   }
  // }



