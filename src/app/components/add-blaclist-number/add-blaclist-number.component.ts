import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlacklistService } from '@app/services/blacklist.service';
import Swal from 'sweetalert2';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
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
  sampleCSVData: any;
  
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    noDownload: false,
    headers: ['PhoneNumber']
  };

  constructor(
    private formBuilder: FormBuilder,
    private blacklistService: BlacklistService,
    private router: Router) { }

  ngOnInit() {
    this.addBlackListForm = this.formBuilder.group({
      file: [''],
      msisdn: [''],
    });
  

  this.sampleCSVData = [
    {
      PhoneNumber: '9859859858',
    },
    {
      PhoneNumber: '8765456783',
    },
    {
      PhoneNumber: '8765456784',
    },
    {
      PhoneNumber: '8765456785',
    },
    {
      PhoneNumber: '8765456786',
    },
    {
      PhoneNumber: '6387008181',
    },
    {
      PhoneNumber: '8053112233',
    }
  ];
  }

  uploadCsvFile(event) {
    this.file = event.target.files[0];
    console.log(event, "fileUpload")
  }


  onUploadBlackList() {
    this.showLoader = true;
    let userId = sessionStorage.getItem('userId');
  
    // Assuming you have access to the uploaded file, let's assume it's named 'uploadedFile'
    const uploadedFile: File = this.file;
  
    // Create a FileReader to read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = reader.result as string;
  
      // Split the content by newline to get rows
      const rows = content.split('\n');
  
      // Check if the first row (header) is "PhoneNumber"
      const headerRow = rows[0];
      if (headerRow.trim() !== 'PhoneNumber') {
        this.showLoader = false;
        Swal.fire({
          // title: 'Invalid File',
          text: 'The file must have a header named "PhoneNumber".',
          icon: 'error',
          
          confirmButtonText: 'OK',
          customClass: {
            icon: 'custom-icon-class',
          },
          width: '250px'
        });
        return; // Exit function if the header is invalid
      }
  
      // Iterate through the rows and validate phone numbers
      for (let i = 1; i < rows.length - 1; i++) {
        const PhoneNumber = rows[i].trim();
        if (!/^\d{10}$/.test(PhoneNumber)) {
          this.showLoader = false;
          Swal.fire({
            title: 'Invalid Phone Number',
            text: `Row ${i + 1}: The phone number must be 10 digits long.`,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '250px'
          });
          return; // Exit function if a phone number is invalid
        }
      }

      // If all validations pass, upload the file
      this.blacklistService.uploadBlackListData(userId, uploadedFile).subscribe({
        next: (res: any) => {
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
      });
    };
  
    // Read the file content as text
    reader.readAsText(uploadedFile);
  }
  
  onCancel() {
    this.addBlackListForm.get('file').setValue('');
  }

  downloadCSV() {
    new  AngularCsv(this.sampleCSVData, 'Sample_Black_List', this.csvOptions);
  }

}
