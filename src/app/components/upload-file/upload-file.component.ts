import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})

export class UploadFileComponent {

  loading: boolean = false;
  switchState: boolean = false;
  dnd: boolean = false;
  dupliacteNo: boolean = false;
  file: File = null;
  public data_upload: any[];
  fileToUpload: File
  campaignName: any;
  uploadForm: FormGroup;
  public filteredWebsites: null
  public campaignList : any
  leadNameErrorCheck: boolean = false;
  testLeadDone: boolean;
  leadPriority: boolean;
  weightPriority:boolean
  leadWeight: number;

  constructor(private uploadservice: UploadService, private formbuilder: FormBuilder) {

    this.uploadForm = this.formbuilder.group({
      file: this.file,
      dnd: this.dnd,
      dupliacteNo: this.dupliacteNo,
      campaignName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]+$')]],
      leadFilterType: ['UF', Validators.required],
      

    })
  }

  ngOnInit(): void {

  }

  onChange(event) {
    this.file = event.target.files[0];
  }


  onUpload() {
    const formdata: FormData = new FormData();
    this.loading = !this.loading;
    console.log(this.file);
    this.uploadservice.upload(this.file, this.campaignName).subscribe(
      (data: any) => {

      }
    );
  }

  onSubmit() {

    this.dnd = this.uploadForm.get('dnd')?.value;
    this.file = this.uploadForm.get('file')?.value;
    this.dupliacteNo = this.uploadForm.get('dupliacteNo')?.value
    console.log(this.uploadForm.value)

  }
  

  campaignChange(event){
//code
  }

  radioChange(type: string){
    //code
  }
}