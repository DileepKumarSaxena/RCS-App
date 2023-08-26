import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlacklistService } from '@app/services/blacklist.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-blaclist-number',
  templateUrl: './add-blaclist-number.component.html',
  styleUrls: ['./add-blaclist-number.component.scss']
})
export class AddBlaclistNumberComponent {
  addBlackListForm: FormGroup;
  public showLoader = false;
  file: File = null;
  fileUploadedData: any[];

  constructor(
    private formBuilder: FormBuilder,
    private blacklistService: BlacklistService,
    private router: Router) { }

  ngOnInit() {
    this.addBlackListForm = this.formBuilder.group({
      file: [''],
      msisdn: [''],
    });
  }


  uploadCsvFile(event) {
    this.file = event.target.files[0];
    console.log(event, "fileUpload")
  }


  onUploadBlackList() {
    this.showLoader = true;
    let userId = sessionStorage.getItem('userId');
    this.blacklistService.uploadBlackListData(userId, this.file).subscribe({
      next: (res:any) => {
          this.fileUploadedData = res;
          this.showLoader = false;
          Swal.fire({
            title: 'Data Uploaded Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px'
          }).then(() => {
            this.addBlackListForm.reset();
            this.router.navigate(['/blacklist']);
          });
      },
      error: (error) => {
        console.error('API Error:', error);
        this.showLoader = false;
        Swal.fire({
          title: 'Error',
          text: 'Error while uploading the Blacklist Numbers.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            icon: 'custom-icon-class',
          },
          width: '300px'
        });
      }
    }
    );
  }

  onCancel() {
    window.location.reload();
  }

}
