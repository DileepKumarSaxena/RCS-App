import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserService } from '@app/_services';
import Swal from 'sweetalert2';

function noSpecialCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value);
    return forbidden ? { 'noSpecialCharacters': true } : null;
  };
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  addUserForm: FormGroup;
  loading = false;
  submitted = false;
  hasTyped: boolean = false;
  returnUrl: string;
  error = '';
  file: File;
  logoError: string = '';
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  selectedBannerName: string | null = null;
  bannerError: string = '';
  isLogoValid: boolean = false;
  actionBtn: string = "Register";
  heading: string = "ADD";
  id: any;

  public showLoader = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userservice: UserService,
    private activatedRoute: ActivatedRoute
  ) {
  }



  ngOnInit() {
    this.addUserForm = this.formBuilder.group({

      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)],],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/), Validators.minLength(8),],],
      confirmPassword: ['', [Validators.required]],
      Username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noSpecialCharactersValidator()]],
      selectparentUser: ['', Validators.required],
      botId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      botToken: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      companyLogo: ['', Validators.required],
      companyBanner: [''],
      companyName: ['', Validators.required]
    },
      {
        validator: this.mustMatch('password', 'confirmPassword')
      });

    this.getRouteParams();
  }

  getRouteParams() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res['id']) {
        this.id = res['id'];
        this.getCampaignInfo();
        this.actionBtn = 'Update';
        this.heading = 'UPDATE';
      }
    })
  }

  getCampaignInfo() {
    this.userservice.edituserData(this.id).subscribe({
      next: (res) => {
        this.addUserForm.patchValue(res);
        this.addUserForm.controls['userName'].disable();
      },
      error: (err) => {
        console.log(err, "ERRRRRRROOORRRRR")
      }
    })
  }

  validateUsername() {
    this.hasTyped = true;
  }

  onPhoneNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const maxLength = 10;
    input.value = sanitizedValue.slice(0, maxLength); // Limit to 10 digits
    this.addUserForm.controls['phoneNumber'].setValue(input.value);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ mustMatch: true });
    } else {
      formGroup.get('confirmPassword').setErrors(null);
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  get f() { return this.addUserForm.controls; }

  handleCompanyLogoChange(event: any): void {

    const inputElement = event.target as HTMLInputElement;
    const file = event.target.files[0];

    if (!file) {
      this.selectedFileName = null;
      this.logoError = 'Please Select Logo';
      return;
    }

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]; // Store the File object
      this.selectedFileName = this.selectedFile.name;
      this.logoError = null;
    }

    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      if (img.width < 250 && img.height < 250) {
        this.logoError = '';
        this.isLogoValid = true;
      } else {
        this.logoError = 'Logo dimensions must be 250x250 pixels or smaller.';
        this.isLogoValid = false;
      }
    };
  }

  handleCompanyBannerChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = event.target.files[0];

    if (!file) {
      this.selectedBannerName = null;
      // this.bannerError = 'Please select a banner';
      return;
    }

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedBannerName = inputElement.files[0].name;
      this.bannerError = ''; // Reset the banner error when a banner is selected
    }

    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    // img.onload = () => {
    //   if (img.width === 800 && img.height === 200) {
    //     this.bannerError = '';
    //   } else {
    //     this.bannerError = 'Banner dimensions must be 800x200 pixels.';
    //   }
    // };
  }

  onSubmit() {
    this.submitted = true;
    if (!this.addUserForm.get('companyLogo').value) {
      this.logoError = 'Please select a logo';
      return;
    }

    if (!this.isLogoValid) {
      this.logoError = 'Logo dimensions are not valid';
      return;
    }

    // if (!this.addUserForm.get('companyBanner').value) {
    //   this.bannerError = 'Please select a banner';
    //   return;
    // } else if (this.bannerError) {
    //   // If there's a banner error, prevent submission
    //   return;
    // }

    if (this.addUserForm.invalid) {
      this.error = 'Please Fill All the Required Fields';
      return;
    } else {
      this.error = '';
    }

    this.loading = true;

    const companyLogo = this.addUserForm.get('companyLogo').value;
    const companyBanner = this.addUserForm.get('companyBanner').value;

    const logoBlob = new Blob([companyLogo], { type: companyLogo.type });
    const bannerBlob = new Blob([companyBanner], { type: companyBanner.type });


    const userJson = {
      userName: this.f.Username.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      userPassword: this.f.password.value,
      email: this.f.email.value,
      phone: this.f.phoneNumber.value,
      parentUserId: sessionStorage.getItem('userId'),
      dailyUsageLimit: sessionStorage.getItem('dailyUsageLimit'),
      botId: this.f.botId.value,
      botToken: 'Basic ' + this.f.botToken.value,
      companyName: this.f.companyName.value,
    };

    const requestData = new FormData();
    requestData.append('userJson', JSON.stringify(userJson));
    requestData.append('companyLogo', this.selectedFile, 'logo.png');
    // requestData.append('companyBanner',  this.selectedFile, 'banner.png');

    this.userservice.addNewUser(requestData)
      .subscribe({
        next: (res) => {
          if (res.Status === '201 CREATED' && res.message === 'User Already Exist.') {
            // Handle user already exists scenario
            Swal.fire({
              title: 'User Already Exists',
              icon: 'warning',
              confirmButtonColor: '#F34335',
              width: '240px',
            });
            this.loading = false;

          } else {
            // Handle success scenario
            Swal.fire({
              title: 'User Registered Successfully',
              icon: 'success',
              confirmButtonColor: '#F34335',
              width: '260px',
            });
            this.loading = false;
            this.router.navigate(['/addUser']);
          }
        },
        error: (err) => {
          this.error = 'Error While Adding the User!';
          this.loading = false;
        }
      });


    if (this.id) {
      let formData = this.addUserForm.value;
      formData['campaignId'] = this.id;
      this.userservice.edituserData(this.addUserForm.value).subscribe({
        next: (res) => {
          this.showLoader = false
          Swal.fire({
            title: 'User Updated Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            width: '300px',
          }).then(() => {
            this.addUserForm.reset();
            this.router.navigate(['/addUser']);
          });
        },
        error: () => {
          this.showLoader = false
          Swal.fire({
            title: 'Error',
            text: 'Error while updating the User Details.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              icon: 'custom-icon-class',
            },
            width: '300px',
          });
        },
      });
    }
  }
}
