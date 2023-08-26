import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BlacklistService } from '@app/services/blacklist.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-blaclist-number',
  templateUrl: './blaclist-number.component.html',
  styleUrls: ['./blaclist-number.component.scss']
})
export class BlaclistNumberComponent {
  createBlackListForm:FormGroup;
  searchlackListForm: FormGroup;
  displayedColumns: string[] = ['id', 'createDtm', 'phoneNumber', 'actions'];
  dataSource!: MatTableDataSource<any>;
  blackListData: any = [];
  public showLoader = false;
  moment: any = moment;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder, private blacklistService: BlacklistService) { }

  ngOnInit(): void {
    this.submitBlackList();
    this.searchBlackList();
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator; 
    this.getBlackListNumbers();
  }

  submitBlackList(){
    this.createBlackListForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator, Validators.maxLength(10)]],
    })
  }

  searchBlackList() {
    this.searchlackListForm = this.formBuilder.group({
      search: ['', [Validators.required, this.searchValidator, Validators.maxLength(10)]]
    })
  }

  phoneNumberValidator(control: FormControl) {
    const transformedValue = control.value.replace(/[^0-9]/g, '');
    if (transformedValue !== control.value) {
      control.setValue(transformedValue);
    }
    return null;
  }
  searchValidator(control: FormControl) {
    const transformedValue = control.value.replace(/[^0-9]/g, '');
    if (transformedValue !== control.value) {
      control.setValue(transformedValue);
    }
    return null;
  }

  getBlackListNumbers() {
    this.showLoader = true;
    let userId = sessionStorage.getItem('userId');
    this.blacklistService.findAllBlackListNoByUserId(userId).subscribe({
      next: (res: any) => {
        this.blackListData = res.data;
        this.dataSource.data = this.blackListData;
        console.log('Blacklist Number:', res);
        this.showLoader = false;
      },
      error: (error) => {
        this.showLoader = false;
        console.error('Blacklist Number Error:', error);
      }
    }
    );
  }

  deleteRow(id: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this Blacklist Number?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning',
      confirmButtonColor: '#5FC29F',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.blacklistService.deleteBlacklist(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Blacklist No. Deleted Successfully',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
            this.getBlackListNumbers();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error while deleting the records.',
              customClass: {
                icon: 'custom-icon-class',
              },
              width: '300px',
            });
          }
        });
      }
    });
  }


  searchBlackListNo() {
    this.showLoader = true;
    const userId = sessionStorage.getItem('userId');
    const search = this.searchlackListForm.value.search;
    this.blacklistService.searchBlackListDetails(userId, search).subscribe({
      next: (res: any) => {

        if (res.status === 404) {
          Swal.fire({
            title: res.msg,
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
        } else {
          Swal.fire({
            title: 'Record Founded.',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
          this.blackListData = [res.data];
        this.dataSource.data = this.blackListData;
        console.log('API Response:', res);
        this.searchlackListForm.reset();
        this.searchlackListForm.get('search').disable();
        this.showLoader = false;
        }

       
      },
      error: (error) => {
        this.showLoader = false;
        if (error.status === 404) {
          // Show error message for status code 404
          Swal.fire({
            title: 'Record Not Found',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
        } else {
          console.error('API Error:', error);
        }
      }
    });
  }
  



  createBlackListNumbers() {
    let userId = sessionStorage.getItem('userId');
    let phoneNumber = this.createBlackListForm.value.phoneNumber;
    this.blacklistService.submitBlackListData(userId, phoneNumber).subscribe(
      (res: any) => {
        if (res.status === 201) {
          Swal.fire({
            title: res.msg,
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
        } else {
          Swal.fire({
            title: 'Number Blacklisted Successfully!',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
          this.showLoader = false;
          this.createBlackListForm.reset();
          this.searchlackListForm.get('phoneNumber').disable();
          this.getBlackListNumbers();
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('API Error:', error);
      }
    );
  }

}
