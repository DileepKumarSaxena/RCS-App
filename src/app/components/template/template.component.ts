import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '@app/services/template.service';
import { Location } from '@angular/common';
import moment from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  templateForm: FormGroup;
  messageTypes: any = [];
  allTemplateList: any = [];
  existingCampaignNames: any = [];
  isHidden: any;
  isHidden2: any;
  actionBtn: string = "Submit";
  cmpId: any;
  fileUploading = false;
  selected: any;
  rows: any[] = [];
  items: FormArray;




  selectedOption: any;
  leadExecutionData: any = [
    { leadExecutionData: 'static', leadExecutionName: 'Static' },
    { leadExecutionData: 'Dynamic', leadExecutionName: 'Dynamic' }
  ]


  constructor(
    private formbuilder: FormBuilder,
    private templateService: TemplateService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.createTemplateForm();
  }


  createTemplateForm() {
    this.templateForm = this.formbuilder.group({
      templateCode: [],
      templateType: [],
      templateJson: [],
      items: new FormArray([])
    })
  }
  createItem(): FormGroup {
    return this.formbuilder.group({
      date: [],
      amount: [],
    });
  }
  onSubmit() {
    console.log('Hellllooo');
    let data = this.templateForm.value;
    let tempData = this.dataCreate(data);
    console.log(tempData, "tmD");
    // if (this.templateForm.valid) {
    //   this.templateService.templateDataSubmit(tempData).subscribe({
    //     next: (res) => {
    //       console.log(res, "Template....")
    //       Swal.fire({
    //         title: 'Template Created Successfully',
    //         icon: 'success',
    //         confirmButtonText: 'OK',
    //         customClass: {
    //           icon: 'custom-icon-class',
    //         },
    //         width: '300px'
    //       }).then(() => {
    //         this.templateForm.reset();
    //       });
    //     },
    //     error: () => {
    //       Swal.fire({
    //         title: 'Error',
    //         text: 'Error while adding the Template Details.',
    //         icon: 'error',
    //         confirmButtonText: 'OK',
    //         customClass: {
    //           icon: 'custom-icon-class',
    //         },
    //         width: '300px'
    //       });
    //     },
    //   });

    // }
  }

  dataCreate(val) {

    if (val.items.length > 0) {
      val.items.forEach((element, i) => {
        console.log(element, "elele", i);
        val.items[i]['date'] = element.date ? moment(element.date).format('YYYY-MM-DDTHH:mm:ssZ') : null;
      });
    }

    let obj = {
      'RCSMessage': {
        'templateMessage': {
          'templateCode': val.templateCode,
        },
        'messageContact': {
          'userContact': 'MSISDN'
        }
      }
    }
    if (val.templateType == 'DynamicJson') {
      obj['RCSMessage']['templateMessage']['customParams'] = val.items;
    }
    return obj;
  }
  tempSelection() {
    if (this.templateForm.get('templateType').value == 'DynamicJson') {
      console.log("DDDLDLLDLLD");
      this.addRow();
    } else {
      console.log("elelele");
      const arr = <FormArray>this.templateForm.controls.items;
      arr.controls = [];

    }
  }
  onTemplateTypeChange(event: Event): void {
    this.selected = (event.target as HTMLSelectElement).value;
  }

  // Function to add a new row
  addRow(){
    this.items = this.templateForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  // Function to remove the last row
  removeRow(index: number) {
    if (this.rows.length > 0) {
      this.rows.pop();
    }
  }

  goBack(): void {
    this.location.back();
  }

}
