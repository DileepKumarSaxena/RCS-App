import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services';
declare var require: any;
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TemplateService } from '@app/services/template.service';
import { Template, TemplateJson } from '@app/_models';
import { AlertService } from '@app/services';
import moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-xiaomircs',
  templateUrl: './xiaomircs.component.html',
  styleUrls: ['./xiaomircs.component.scss']
})
export class XiaomircsComponent implements OnInit {
  templateForm: FormGroup;
  templateName: string;
  fileName: string = '';
  fileUrl: any;
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
  moment: any = moment;
  extractedVariables: string[] = [];
  cardDetailsArrayToString: string[] = [];
  templateCodeVal: boolean = false;
  forTestVariable: string[] = [];

  rows: any[] = [];
  suggestions: FormArray;
  cardDetails: FormArray;
  templateTypeValue: any = [{ value: 'Rich Card Stand Alone', key: 'rich_card' }, { value: 'Rich Card Carousel', key: 'carousel' }, { value: 'Text Message', key: 'text_message' }]
  cardOrientationValue: any = [{ value: 'HORIZONTAL', key: 'HORIZONTAL' }, { value: 'VERTICAL', key: 'VERTICAL' }]
  cardHeightValue: any = [{ value: 'SHORT', key: 'SHORT_HEIGHT' }, { value: 'MEDIUM', key: 'MEDIUM_HEIGHT' }]
  cardWidthValue: any = [{ value: 'SMALL', key: 'SMALL_WIDTH' }, { value: 'MEDIUM', key: 'MEDIUM_WIDTH' }]
  suggestionActionValue: any = [{ value: 'URL Action', key: 'url_action' }, { value: 'Dialer Action', key: 'dialer_action' }, { value: 'Reply', key: 'reply' }]




  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private alertService: AlertService,
    private router: Router,
    private location: Location) {
    this.templateForm = this.fb.group({

    })
  }

  ngOnInit() {
    this.createTemplateForm();
  }
  createTemplateForm() {
    this.templateForm = this.fb.group({
      templateCode: ['', [Validators.required, Validators.maxLength(20)]],
      templateType: ['rich_card'],
      fileName: null,
      mediaFileOriginalName: [''],
      cardtitle: ['', [Validators.required, Validators.maxLength(200)]],
      cardTitleCustomParam: [],
      cardDescriptionCustomParam: [],
      messageContentCustomParam: [],
      cardDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      messageContent: [''],
      cardOrientation: ['VERTICAL'],
      mediaHeight: ['SHORT_HEIGHT'],
      cardWidth: ['SMALL_WIDTH'],
      suggestions: new FormArray([]),
      cardDetails: new FormArray([])
    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      suggestionType: ['reply'],
      displayText: [''],
      postback: [''],
      url: [''],
      phoneNumber: [''],
      // displayTextCustomParam:[],
      // postbackCustomParam:[],
      // urlCustomParam:[]
    });
  }
  createCards(): FormGroup {
    return this.fb.group({
      cardWidth: ['SMALL_WIDTH'],
      mediaHeight: ['SHORT_HEIGHT'],
      fileName: [],
      mediaUrl: [null],
      fileNameDisplay: [],
      cardtitle: [],
      cardDescription: [],
      // mediaFileOriginalName: [''],
      // cardTitleCustomParam:[],
      // cardDescriptionCustomParam:[],
    });
  }
  tabs = [];
  addTab() {
    this.cardDetails = this.templateForm.get('cardDetails') as FormArray;
    if (this.cardDetails.value.length < 5) {
      this.cardDetails.push(this.createCards());
      this.tabs.push('Card ' + this.cardDetails.value.length);
    }
  }
  getClassName(data) {
    console.log(data, "DDDDDDDD");
    return "Vertical"
  }
  // Function to add a new row
  addRow() {
    let loopCount = this.templateForm.get('templateType').value == 'text_message' ? 10 : 4;
    this.suggestions = this.templateForm.get('suggestions') as FormArray;
    if (this.suggestions.value.length < loopCount) {
      this.suggestions.push(this.createItem());
      console.log(this.templateForm.get('suggestions'), "suggestions");
    }
  }

  // Function to remove the last row
  removeRow(index: number) {
    this.suggestions = this.templateForm.get('suggestions') as FormArray;
    if (index > -1) {
      console.log(index, this.suggestions);
      this.suggestions.removeAt(index);
    }
  }

  getImage(imagePath) {
    console.log(imagePath, "imagePath");
    return imagePath;
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
    // this.getStringBetweenBraces();
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
      this.templateForm.get('mediaFileOriginalName').patchValue(input.files[0].name);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileName = e.target.result;
        this.templateForm.get("fileName").setValue(input.files[0]);
      };
      reader.readAsDataURL(input.files[0]);

      let maxImageSize = 2 * 1024 * 1024; // 1MB
      let file = input.files[0];
      let fileSize = file.size;
      let fileType = file.type.split('/')[0]; // 'image' or 'video'

      if (fileType !== 'image') {
        this.fileSizeError = true;
        this.fileSizeErrorMessage = 'Only image files are allowed.';
        input.value = ''; // Clear the selected file
      } else if (fileSize > maxImageSize) {
        this.fileSizeError = true;
        this.fileSizeErrorMessage = 'The selected image exceeds the maximum file size of 1MB.';
        input.value = ''; // Clear the selected file
      } else {
        // Check if the file name contains any special characters except underscore
        const fileName = input.files[0].name;
        const regex = /^[A-Za-z0-9_]+\.(jpg|jpeg|png|gif)$/; // Only allows alphanumeric characters and underscores in the file name, and specific image file extensions
        if (!regex.test(fileName)) {
          this.fileSizeError = true;
          this.fileSizeErrorMessage = 'File names must contain only letters, numbers, and underscores, and end with a valid image file extension.';
          input.value = ''; // Clear the selected file
        } else {
          this.fileSizeError = false;
          this.fileSizeErrorMessage = '';
        }
      }
    }
  }


  validateFileCr(input: any, index: any) {
    console.log(input.files, "Fileeee");
    if (input.files && input.files[0]) {
      const reader1 = new FileReader();
      reader1.onload = (e: any) => {
        const dataURL = e.target.result;
        this.cardDetails.at(index).get('fileName').patchValue(dataURL);
        this.cardDetails.at(index).get('fileNameDisplay').patchValue(input.files[0]);
        this.cardDetails.at(index).get('mediaFileOriginalName').patchValue(input.files[0].name);
        console.log(this.cardDetails, "cardDetails")
      };
      reader1.readAsDataURL(input.files[0]);

      let maxImageSize = 2 * 1024 * 1024; // 1MB
      let file = input.files[0];
      let fileSize = file.size;
      let fileType = file.type.split('/')[0]; // 'image' or 'video'

      if (fileType !== 'image') {
        this.fileSizeError = true;
        this.fileSizeErrorMessage = 'Only image files are allowed.';
        input.value = ''; // Clear the selected file
      } else if (fileSize > maxImageSize) {
        this.fileSizeError = true;
        this.fileSizeErrorMessage = 'The selected image exceeds the maximum file size of 1MB.';
        input.value = ''; // Clear the selected file
      } else {
        // Check if the file name contains any special characters except underscore
        const fileName = input.files[0].name;
        const regex = /^[A-Za-z0-9_]+\.(jpg|jpeg|png|gif)$/; // Only allows alphanumeric characters and underscores in the file name, and specific image file extensions
        if (!regex.test(fileName)) {
          this.fileSizeError = true;
          this.fileSizeErrorMessage = 'File names must contain only letters, numbers, and underscores, and end with a valid image file extension.';
          input.value = ''; // Clear the selected file
        } else {
          this.fileSizeError = false;
          this.fileSizeErrorMessage = '';
        }
      }

    }
  }


  addCustomVariable(formCtrl) {
    console.log(formCtrl, "Add custom_param");
    let cardDescriptionControl = this.templateForm.get(formCtrl);
    if (!cardDescriptionControl.value.includes('[custom_param]')) {
      let currentValue = cardDescriptionControl.value;
      let updatedValue = currentValue + ' [custom_param] ';
      cardDescriptionControl.setValue(updatedValue);
    }

  }

  onSubmit() {
    this.templateCodeVal = true;
    if (this.templateForm.invalid) {
      return;
    }
    console.log(this.templateForm, "templateForm....");
    if (this.templateForm.valid) {
      let data = this.templateForm?.value;
      console.log(data, "Data....");
      let tempData: any = this.dataCreate(data);
      const body = JSON.stringify(tempData);
      const formData = new FormData();
      const cardDetails = this.templateForm.get('cardDetails').value;
      if (cardDetails?.length) {
        cardDetails?.forEach(element => {
          formData.append('files', element?.fileNameDisplay);
        });
      } else {
        console.log(this.fileUrl, "files");
        // let fName = this.updateFiles(this.fileUrl);
        formData.append('files', this.templateForm.get('fileName').value);

      }
      formData.append('addTemplate', body?.toString());
      console.log(formData, "templateForm");
      this.templateService.templateDataSubmit(formData).subscribe({
        next: (res: any) => {
          console.log(res, "Template....")
          this.alertService.successToaster('Template Created Successfully');
          this.templateForm.reset();
          this.router.navigate(['/templateList']);
        },
        error: (error: string) => {
          if (error) {
            this.alertService.errorToaster(error);
          }
        },
      });

    }
  }
  onCancel() {
    window.location.reload();
  }
  // updateFiles(data) {
  //   if (data['name'].includes('.jpeg')) {
  //     let arr = data.name.split('.jpeg')
  //     // data['name'] = arr[0] + moment().format('YYYY-MM-DD') + '.jpeg';
  //     data.name = 'Hello';
  //     console.log(arr[0] + new Date() + '.jpeg');
  //   }
  //   console.log(data['name']);
  // }

  getName(index) {
    return 'Card ' + index;
  }

  removeTab(index: number) {
    // this.tabs.splice(index, 1);
    console.log(index, "Index..........");
    if (this.cardDetails.length > 2) {
      this.cardDetails.removeAt(index);
      this.tabs.splice(index, 1);
    }
  }

  extractVariables(inputString: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputString))) {
      matches.push(match[1]);
    }
    return matches;
  }

  displayVariables(event: Event, formCtrl: any, flag: any, index?: any): any {
    let inputElement = event.target as HTMLInputElement;
    let inputString = inputElement.value;
    let extractedVariables = this.extractVariables(inputString);
    const temp: any = [];
    extractedVariables?.forEach((item, idx) => {

      if (idx >= 0) {
        temp?.push(item);
        console.log(item, idx, "item.....");
      }
    })
    console.log(temp, "temp.....");
    this.forTestVariable.push(...temp);

    // var convertArrayToString = extractedVariables.reduce((current, value, index) => {
    //   if (index > 0)
    //     current?.push(value);

    //   return current;
    // }, []);
    // this.cardDetailsArrayToString = convertArrayToString;
    //console.log(convertArrayToString, "convertArrayToString....");
    // let val;
    // if (this.cardDetailsArrayToString) {
    //   val = this.cardDetailsArrayToString.concat(",", convertArrayToString);
    // }
    // else {
    //   val = convertArrayToString;
    // }
    // convertArrayToString = val;
    // this.cardDetailsArrayToString = convertArrayToString;
    if (flag == 1) {
      this.templateForm.get(formCtrl).setValue(String(temp));
      // String(temp) = convertArrayToString;
    } else if (flag == 2) {
      this.cardDetails.at(index).get(formCtrl).patchValue(String(temp));
      // String(temp) = convertArrayToString;
    } else {
      this.suggestions.at(index).get(formCtrl).patchValue(String(temp));
      // String(temp) = convertArrayToString;
    }

    // console.log('cardDetailsArrayToString....', String(temp) );
    // console.log('Extracted Variables:', convertArrayToString);
  }

  dataCreate(val: any) {
    let xyz: any = [];
    const cardTitleCustomParam = this.extractVariables(this.templateForm.get('cardtitle').value);
    const cardDescriptionCustomParam = this.extractVariables(this.templateForm.get('cardDescription').value);
    const messageContentCustomParam = this.extractVariables(this.templateForm.get('messageContent').value);
    xyz = [...cardTitleCustomParam, ...cardDescriptionCustomParam, ...messageContentCustomParam];

    const cardDetails = this.templateForm.get('cardDetails').value;
    cardDetails.forEach(element => {
      const cardTitleCustomParam = this.extractVariables(element?.cardtitle);
      const cardDescriptionCustomParam = this.extractVariables(element?.cardDescription);
      if (cardTitleCustomParam?.length) {
        xyz = [...xyz, ...cardTitleCustomParam]
      }
      if (cardDescriptionCustomParam?.length) {
        xyz = [...xyz, ...cardDescriptionCustomParam]
      }
    });
    
    const suggestions = this.templateForm.get('suggestions').value;
    suggestions.forEach(element => {
      const displayTextCustomParam = this.extractVariables(element?.displayText);
      const postbackCustomParam = this.extractVariables(element?.postback);
      if (displayTextCustomParam?.length) {
        xyz = [...xyz, ...displayTextCustomParam]
      }
      if (postbackCustomParam?.length) {
        xyz = [...xyz, ...postbackCustomParam]
      }
    });

   





    // this.templateForm.get('cardTitleCustomParam').value;
    const component = this;
    console.log(val, "VAAAA");
    const obj = {
      templateCode: val?.templateCode,
      templateType: val?.templateType,
      templateMsgType: val.templateMsgType,
      templateCustomParam: String(xyz),
      templateJson: {
        botId: val.botId,
        suggestions: val.suggestions
      }
    }

    if (val?.templateType === 'rich_card') {
      obj['templateJson']["standAlone"] = {
        cardTitle: val.cardtitle,
        cardDescription: val.cardDescription,
        mediaUrl: val.fileName,
        mediaFileOriginalName: val.mediaFileOriginalName,
        // templateCustomParam: this.cardDetailsArrayToString,
        // cardTitleCustomParam:val.cardTitleCustomParam, 
        // cardDescriptionCustomParam:val.cardDescriptionCustomParam, 
      }

    } else if (val['templateType'] == 'carousel') {
      obj['templateJson']["carouselList"] = val["cardDetails"].map(function (obj) {
        return {
          cardWidth: obj.cardWidth,
          mediaHeight: obj.mediaHeight,
          cardtitle: obj.cardtitle,
          cardDescription: obj.cardDescription,
          mediaFileOriginalName: obj.mediaFileOriginalName,

          // templateCustomParam: component.cardDetailsArrayToString,
          // cardTitleCustomParam:val.cardTitleCustomParam, 
          // cardDescriptionCustomParam:val.cardDescriptionCustomParam, 
        };
      });

    } else {
      obj['templateJson']["messageContent"] = val.messageContent;
      // obj['templateJson']["messageContentCustomParam"]= val.messageContentCustomParam;
    }
    obj.templateJson = JSON.stringify(obj.templateJson) as any;
    return obj;
  }

  goBack(): void {
    this.location.back();
  }



}
