import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services';
declare var require: any;
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TemplateService } from '@app/services/template.service';
@Component({
  selector: 'app-xiaomircs',
  templateUrl: './xiaomircs.component.html',
  styleUrls: ['./xiaomircs.component.scss']
})
export class XiaomircsComponent implements OnInit {
  templateForm: FormGroup;
  templateName: string;
  fileName: string = '';
  cardtitle: string;
  cardDescription: string;
  messagecontent: string;
  suggestionText: string;
  suggestionPostback: string;
  actionButton1Title: string;
  actionButton1URL: string;
  actionButton2Title: string;
  actionButton2URL: string;
  actionButton3Title: string;
  actionButton3URL: string;

  fileSizeError = false;
  fileSizeErrorMessage = '';
  selectedOption: string;

  rows: any[] = [];
  items: FormArray;
  cardDetails: FormArray;




  constructor(private fb: FormBuilder, private templateService: TemplateService, private location: Location) {
    this.templateForm = this.fb.group({

    })
  }

  ngOnInit() {
    this.createTemplateForm();
  }
  createTemplateForm() {
    this.templateForm = this.fb.group({
      templateCode: [''],
      templateType: ['rich_card'],
      fileName: null,
      cardtitle: [''],
      cardDescription: [''],
      messageContent: [''],
      cardOrientation:['VERTICAL'],
      mediaHeight:['SHORT_HEIGHT'],
      items: new FormArray([]),
      cardDetails: new FormArray([])
    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      suggestionType: ['reply'],
      displayText: [],
      postback: [],
      url: [],
    });
  }
  createCards(): FormGroup {
    return this.fb.group({
      cardWidth: ['SMALL_WIDTH'],
      mediaHeight: ['SHORT_HEIGHT'],
      fileName: [],
      cardtitle: [],
      cardDescription: []
    });
  }
  tabs = [];
  addTab() {
    this.cardDetails = this.templateForm.get('cardDetails') as FormArray;
    if(this.cardDetails.value.length < 5){
      this.cardDetails.push(this.createCards());
      this.tabs.push('Card ' + this.cardDetails.value.length);
    }
  }
  // Function to add a new row
  addRow() {
    let loopCount = this.templateForm.get('templateType').value == 'text_message'?10:4;
    this.items = this.templateForm.get('items') as FormArray;
    if(this.items.value.length < loopCount){
          this.items.push(this.createItem());
    }
  }

  // Function to remove the last row
  removeRow(index: number) {
    this.items = this.templateForm.get('items') as FormArray;
    if (index > -1) {
      console.log(index, this.items);
      this.items.removeAt(index);
    }
  }
  templateNameCharacterCount(event: any) {
    let value = event.target.value as string;
    if (value.length > 20) {
      value = value.substr(0, 20);
    }
    const templateNameControl = this.templateForm.get('templateCode');
    templateNameControl.setValue(value);
  }
  cardTitleCharacterCount(event: any) {
    let value = event.target.value as string;
    if (value.length > 200) {
      value = value.substr(0, 200);
    }
    const templateNameControl = this.templateForm.get('cardtitle');
    templateNameControl.setValue(value);
  }

  cardDescriptionCharacterCount(event: any) {
    let value = event.target.value as string;
    if (value.length > 2000) {
      value = value.substr(0, 2000);
    }
    const templateNameControl = this.templateForm.get('cardDescription');
    templateNameControl.setValue(value);
  }
  messageContentCharacterCount(event: any) {
    let value = event.target.value as string;
    if (value.length > 2500) {
      value = value.substr(0, 2500);
    }
    const templateNameControl = this.templateForm.get('messageContent');
    templateNameControl.setValue(value);
  }


  validateFile(input: any) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileName = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }

    let maxImageSize = 2 * 1024 * 1024; // 2MB
    let maxVideoSize = 10 * 1024 * 1024; // 10MB

    let file = input.files[0];
    let fileSize = file.size;
    let fileType = file.type.split('/')[0]; // 'image' or 'video'

    if (fileType === 'image' && fileSize > maxImageSize) {
      console.log(maxImageSize, "maxImageSize");
      this.fileSizeError = true;
      this.fileSizeErrorMessage = 'The selected image exceeds the maximum file size of 2MB.';
      input.value = ''; // Clear the selected file
    } else if (fileType === 'video' && fileSize > maxVideoSize) {
      console.log(maxVideoSize, "maxVideoSize");
      this.fileSizeError = true;
      this.fileSizeErrorMessage = 'The selected video exceeds the maximum file size of 10MB.';
      input.value = ''; // Clear the selected file
    } else {
      console.log("tjljljl");
      this.fileSizeError = false;
      this.fileSizeErrorMessage = '';
    }
  }


  addCustomVariable(formCtrl) {
    let cardDescriptionControl = this.templateForm.get(formCtrl);
    if (!cardDescriptionControl.value.includes('[custom_param]')) {
      let currentValue = cardDescriptionControl.value;
      let updatedValue = currentValue + ' [custom_param] ';
      cardDescriptionControl.setValue(updatedValue);
    }

  }

  onSubmit() {
    console.log('Hellllooo');
    let data = this.templateForm.value;
    console.log(data, "Data....");
    let tempData = this.dataCreate(data);
    console.log(this.templateForm, "templateForm");

    if (this.templateForm.valid) {
      this.templateService.templateDataSubmit(tempData).subscribe({
        next: (res) => {
          console.log(res, "Template....")
          Swal.fire({
            title: 'Template Created Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px'
          }).then(() => {
            this.templateForm.reset();
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Error while adding the Template Details.',
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
  dataCreate(val) {
    let obj: any = {
      'templateCode': val.templateCode,
      'templateType': val.templateType,
      templeteJson: {
        'botId': 12345,
        standAlone: {
          'cardTitle': val.cardtitle,
          'textMessageContent': val.cardDescription,
          'fileName': val.filePreview,
          'suggestions': val.items
        }
      }
    }
    obj.templeteJson = JSON.stringify(obj.templeteJson);
    return obj;
  }
  // }
  // dataCreate(val) {
  //   let obj = {
  //    'name':val.templateCode,
  //    'type':val.templateType,
  //    'textMessageContent':val.cardDescription,
  //    'botId':12345,
  //    'suggestions':val.items
  //   }
  //   return obj;
  // }
  goBack(): void {
    this.location.back();
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

}
