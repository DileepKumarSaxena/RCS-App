import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services';
declare var require: any;
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TemplateService } from '@app/services/template.service';
import { Template, TemplateJson } from '@app/_models';
import { AlertService } from '@app/services';
import moment from 'moment';
import { Router } from '@angular/router';
import { Conditional } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser';
import { event } from 'jquery';


@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {
  templateForm: FormGroup;
  templateName: string;
  fileName: string = '';
  thumbnailFileSizeError: boolean = false;
  thumbnailFileSizeErrorMessage: string = '';
  fileUrl: any;
  cardArr: any = [];
  cardtitle: string;
  cardDescription: string;
  messagecontent: string;
  suggestionText: string;
  suggestionPostback: string;

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
  cardOrientationValue: any = [{ value: 'VERTICAL', key: 'VERTICAL' }, { value: 'HORIZONTAL', key: 'HORIZONTAL' }]
  cardHeightValue: any = [{ value: 'SHORT', key: 'SHORT_HEIGHT' }, { value: 'MEDIUM', key: 'MEDIUM_HEIGHT' }]
  cardAlignmentValue: any = [{ value: 'LEFT', key: 'LEFT' }, { value: 'RIGHT', key: 'RIGHT' }]
  cardWidthValue: any = [{ value: 'SMALL', key: 'SMALL_WIDTH' }, { value: 'MEDIUM', key: 'MEDIUM_WIDTH' }]
  suggestionActionValue: any = [{ value: 'URL Action', key: 'url_action' }, { value: 'Dialer Action', key: 'dialer_action' }, { value: 'Reply', key: 'reply' }]




  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private alertService: AlertService,
    private router: Router,
    private location: Location,
    private sanitizer: DomSanitizer) {
    this.templateForm = this.fb.group({

    })
  }

  ngOnInit() {
    this.createTemplateForm();
    if (this.templateForm.get('templateType').value == 'rich_card') {
      this.setValidation('cardtitle', Validators.required);
      this.setValidation('cardDescription', Validators.required);
      this.setValidation('fileName', Validators.required);

    }
  }

  createTemplateForm() {
    this.templateForm = this.fb.group({
      templateCode: ['', [Validators.required, Validators.maxLength(20)]],
      templateType: ['rich_card'],
      fileName: [null],
      thumbnailFileName: [''],
      mediaFileOriginalName: [''],
      mediaContentType: [''],
      cardtitle: [''],
      cardDescription: [''],
      messageContent: [''],
      cardOrientation: ['VERTICAL'],
      mediaHeight: ['SHORT_HEIGHT'],
      cardAlignment: ['LEFT'],
      cardWidth: ['SMALL_WIDTH'],
      suggestions: new FormArray([]),
      cardDetails: new FormArray([])
    })
  }

  requiredCondtionalVal(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }
    if (formControl.parent.get('templateType').value === 'text_message') {
      return null;
    } else {
      return Validators.required(formControl);
    }
  }
  createItem(): FormGroup {
    return this.fb.group({
      suggestionType: ['reply'],
      displayText: [''],
      postback: [''],
      url: [''],
      phoneNumber: [''],
    });
  }

  suggestionTypeChange(item: AbstractControl) {
    let suggestionTypeControl = item.get('suggestionType');
    let urlControl = item.get('url');
    let phoneNumberControl = item.get('phoneNumber');

    if (suggestionTypeControl.value === 'url_action') {
        urlControl.setValidators([Validators.required]);
        phoneNumberControl.clearValidators();
    } else if (suggestionTypeControl.value === 'dialer_action') {
        urlControl.clearValidators();
        phoneNumberControl.setValidators([Validators.required]);
    }

    urlControl.updateValueAndValidity();
    phoneNumberControl.updateValueAndValidity();
}


addPrefixIfNecessary(event: any) {
  const input = event.target as HTMLInputElement;
  if (!input.value.startsWith('+91')) {
      input.value = '+91';
  }
}

// restrictTo10Digits(event: any) {
//   const input = event.target as HTMLInputElement;
//   if (input.value.startsWith('+91')) {
//       input.value = '+91' + input.value.slice(3, 13);
//   } else {
//       input.value = '+91';
//   }
// }


restrictTo10Digits(event: any) {
  const input = event.target as HTMLInputElement;
  if (input.value.startsWith('+91')) {
    input.value = '+91' + input.value.slice(3, 13).replace(/[^0-9]/g, ''); // Remove non-numeric characters
  } else {
    input.value = '+91' + input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  }
}




  createCards(): FormGroup {
    return this.fb.group({
      cardWidth: ['SMALL_WIDTH'],
      mediaHeight: ['SHORT_HEIGHT'],
      fileName: [null, Validators.required],
      thumbnailFileName: [''],
      mediaFileOriginalName: [''],
      mediaContentType: [''],
      cardtitle: ['', Validators.required],
      cardDescription: ['', Validators.required],
    });
  }
  tabs = [];

  setValidation(frmCtrl: any, validation: any) {
    if (validation) {
      this.templateForm.controls[frmCtrl].setValidators(validation);
      this.templateForm.controls[frmCtrl].updateValueAndValidity();
    } else {
      this.templateForm.controls[frmCtrl].setValidators(null);
      this.templateForm.controls[frmCtrl].updateValueAndValidity();
    }

  }
  templateTypeChange(event: any) {
    this.setValidation('cardtitle', null);
    this.setValidation('cardDescription', null);
    this.setValidation('messageContent', null);
    this.setValidation('fileName', null);
    if (this.cardDetails && this.cardDetails.length > 0) {
      this.cardDetails.clear();
    }

    if (event.target.value == 'rich_card') {
      this.setValidation('cardtitle', Validators.required);
      this.setValidation('cardDescription', Validators.required);
      this.setValidation('fileName', Validators.required);
    }
    else if (event.target.value == 'carousel') {
      this.addTab();
    } else {
      this.setValidation('messageContent', Validators.required);
    }
  }

  addTab() {
    this.cardDetails = this.templateForm.get('cardDetails') as FormArray;
    if (this.cardDetails.value.length < 5) {
      this.cardDetails.push(this.createCards());
      this.tabs.push('Card ' + this.cardDetails.value.length);
    }
  }

  getClassName(data) {
    return "Vertical"
  }

  // Function to add a new row
  addRow() {
    let loopCount = this.templateForm.get('templateType').value == 'text_message' ? 10 : 4;
    this.suggestions = this.templateForm.get('suggestions') as FormArray;
    if (this.suggestions.value.length < loopCount) {
      this.suggestions.push(this.createItem());
    }
  }

  // Function to remove the last row
  removeRow(index: number) {
    this.suggestions = this.templateForm.get('suggestions') as FormArray;
    if (index > -1) {
      this.suggestions.removeAt(index);
    }
  }

  characterCounts(data: any) {
    return data ? data.length : 0;
  }
  fileValidation(input: any, frmval: any, flag: any) {
    const file = input.files && input.files[0];
    let formatType;
    if (file) {

      if (file.type.indexOf('image') > -1) {
        if (flag > -1) {
          this.cardDetails.at(flag).get(frmval).setValidators(null);
          this.cardDetails.at(flag).get(frmval).updateValueAndValidity();
        } else {
          this.setValidation(frmval, null)
          
        }
      } else if (file.type.indexOf('video') > -1) {
        if (flag > -1) {
          this.cardDetails.at(flag).get(frmval).setValidators(Validators.required);
          this.cardDetails.at(flag).get(frmval).updateValueAndValidity();
        } else {
          this.setValidation(frmval, Validators.required);
        }
      }
    }

  }
  // Upload Image or Video ---- StandAlone
  validateFile(input: any, frmCtrl: any, frmCtrlDisplay: any, ind: any, flag: any) {
    const file = input.files && input.files[0];
    let maxImageSize = 1 * 1024 * 1024; // 1MB for images
    let maxVideoSize = 5 * 1024 * 1024; // 5MB for videos
    let fileSize = file.size;
    let formatType;
    if (file) {

      if (file.type.indexOf('image') > -1) {
        formatType = 'image';
      } else if (file.type.indexOf('video') > -1) {
        formatType = 'video';
      }

      if (formatType == 'image') {
        if (ind > -1) {
          this.cardDetails.at(ind).get(frmCtrlDisplay).patchValue(file.name);
          // this.cardDetails.at(ind).get('thumbnailFileName').setValidators(null);
          // this.cardDetails.at(ind).get('thumbnailFileName').updateValueAndValidity();

          if (flag != 'thumbnail') {
            this.cardDetails.at(ind).get(frmCtrl).patchValue(file);
            this.cardDetails.at(ind).get('mediaContentType').patchValue(formatType);
          }
        } else {
          if (fileSize > maxImageSize) {
            this.fileSizeError = true;
            this.fileSizeErrorMessage = 'The selected image exceeds the maximum file size of 1MB.';
          } else {
            this.fileSizeError = false;
            this.fileSizeErrorMessage = '';
            this.templateForm.get(frmCtrlDisplay).patchValue(file.name);
           
            // this.setValidation('thumbnailFileName', null);
            if (flag != 'thumbnail') {
              this.templateForm.get(frmCtrl).patchValue(file);
              this.templateForm.get('mediaContentType').patchValue(formatType);
            }
          }

        }

      } else if (formatType == 'video') {
        if (ind > -1) {
          this.cardDetails.at(ind).get(frmCtrlDisplay).patchValue(file.name);
          this.cardDetails.at(ind).get('mediaContentType').patchValue(formatType);
          this.cardDetails.at(ind).get(frmCtrl).patchValue(file);
          // this.cardDetails.at(ind).get('thumbnailFileName').setValidators(Validators.required);
          // this.cardDetails.at(ind).get('thumbnailFileName').updateValueAndValidity();
        } else {
          this.templateForm.get(frmCtrlDisplay).patchValue(file.name);
          this.templateForm.get('mediaContentType').patchValue(formatType);
          this.templateForm.get(frmCtrl).patchValue(file);
          // this.setValidation('thumbnailFileName', Validators.required);
        }


      }

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        if (formatType == 'image') {
          if (ind > -1) {
            this.cardArr.push({ id: ind, srcVal: event.target.result })
          } else {
            this.fileName = event.target.result;
          }
        }
      }

      if (file) {

        let fileType = file.type.split('/')[0]; // 'image' or 'video'

        if (fileType === 'image') {
          // Image file validation

        } else if (fileType === 'video') {
          // Video file validation
          if (fileSize > maxVideoSize) {
            this.fileSizeError = true;
            this.fileSizeErrorMessage = 'The selected video exceeds the maximum file size of 5MB.';
          } else {
            this.fileSizeError = false;
            this.fileSizeErrorMessage = '';
            // Set the videoFile flag to show the video thumbnail input field
          }
        } else {
          this.fileSizeError = true;
          this.fileSizeErrorMessage = 'Only image and video files are allowed.';
        }


      }
    }
  }


  onSubmit() {
    this.templateCodeVal = true;
    if (this.templateForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill all the required fields.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          icon: 'custom-icon-class',
        },
        width: '300px',
      });
      return;
    }
    if (this.templateForm.valid) {
      let data = this.templateForm?.value;
      let tempData: any = this.dataCreate(data);
      const body = JSON.stringify(tempData);
      const formData = new FormData();
      const cardDetails = this.templateForm.get('cardDetails').value;
      const richCardDetails = this.templateForm.get('templateType').value === 'rich_card'
      if (cardDetails?.length) {
        cardDetails?.forEach(element => {
          formData.append('files', element?.fileName);
        })
      } else if (richCardDetails) {
        formData.append('files', this.templateForm.get('fileName').value);
      }

      formData.append('addTemplate', body?.toString());
      this.templateService.templateDataSubmit(formData).subscribe({
        next: (res: any) => {
          this.alertService.successToaster('Template Created Successfully');
          this.templateForm.reset();
          this.router.navigate(['/templateList']);
        },
        error: (error: string) => {
          if (error) {
            //this.alertService.errorToaster(error);
            Swal.fire({
              title: 'Error',
              text: 'Error while adding the Template Details.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          }
        },
      });

    }
  }
  onCancel() {
    window.location.reload();
  }
  removeTab(index: number) {
    // this.tabs.splice(index, 1);
    if (this.cardDetails.length > 1) {
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
      const urlCustomParam = this.extractVariables(element?.url);
      if (displayTextCustomParam?.length) {
        xyz = [...xyz, ...displayTextCustomParam]
      }
      if (postbackCustomParam?.length) {
        xyz = [...xyz, ...postbackCustomParam]
      }
      if (urlCustomParam?.length) {
        xyz = [...xyz, ...urlCustomParam]
      }
    });

    const obj = {
      templateCode: val?.templateCode,
      templateType:((String(xyz)).length > 0)? 'Dynamic':'Static',
      templateMsgType: val.templateType,
      templateCustomParam: String(xyz),
      templateUserId: sessionStorage.getItem('userId'),
      botId: sessionStorage.getItem('botId'),
      templateJson: {
        suggestions: val.suggestions
      }
    }
    if (val?.templateType === 'rich_card') {

      obj['templateJson']["standAlone"] = {
        cardTitle: val.cardtitle,
        cardDescription: val.cardDescription,
        mediaUrl: val.mediaFileOriginalName,
        mediaFileOriginalName: val.mediaFileOriginalName,
        thumbnailFileOriginalName: val.thumbnailFileName,
        mediaContentType: val.mediaContentType,
        orientation: val.cardOrientation,
        alignment: val.cardAlignment,
        height: val.mediaHeight,

      }

    } else if (val['templateType'] == 'carousel') {

      obj['templateJson']["carouselList"] = val["cardDetails"].map(function (obj) {
        return {
          cardtitle: obj.cardtitle,
          cardDescription: obj.cardDescription,
          mediaUrl: obj.mediaFileOriginalName,
          mediaFileOriginalName: obj.mediaFileOriginalName,
          thumbnailFileOriginalName: obj.thumbnailFileName,
          mediaContentType: obj.mediaContentType,
          orientation: obj.cardOrientation,
          width: obj.cardWidth,
          height: obj.mediaHeight

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

  getName(index) {
    return 'Card ' + index;
  }

}

