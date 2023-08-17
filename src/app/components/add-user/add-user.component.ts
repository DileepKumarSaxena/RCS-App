import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  addUserForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  file: File;
  logoError: string = '';
  selectedFileName: string | null = null;
  selectedBannerName: string | null = null;
  bannerError: string = '';


  isLogoValid: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({

      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)],
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ],

      confirmPassword: ['', [Validators.required]],
      Username: ['', Validators.required],
      selectparentUser: ['', Validators.required],
      companyLogo: ['', Validators.required],
      companyBanner: ['', Validators.required],
      companyName: ['', Validators.required]
    },
      {
        validator: this.mustMatch('password', 'confirmPassword')
      });



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
      this.selectedFileName = inputElement.files[0].name;
      this.logoError = null;
    }

    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      if (img.width === 400 && img.height === 400) {
        this.logoError = '';
        this.isLogoValid = true;
      } else {
        this.logoError = 'Logo dimensions must be 400x400 pixels.';
        this.isLogoValid = false;
      }
    };

  }

  handleCompanyBannerChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = event.target.files[0];

    if (!file) {
      this.selectedBannerName = null;
      this.bannerError = 'Please select a banner';
      return;
    }

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedBannerName = inputElement.files[0].name;
      this.bannerError = ''; // Reset the banner error when a banner is selected
    }

    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      if (img.width === 800 && img.height === 200) {
        this.bannerError = '';
      } else {
        this.bannerError = 'Banner dimensions must be 800x200 pixels.';
      }
    };
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


    if (!this.addUserForm.get('companyBanner').value) {
      this.bannerError = 'Please select a banner';
      return;
    } else if (this.bannerError) {
      // If there's a banner error, prevent submission
      return;
    }



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


    const formData = new FormData();

    // Append fields data to formData
    formData.append('firstName', this.f.firstName.value);
    formData.append('lastName', this.f.lastName.value);
    formData.append('email', this.f.email.value);
    formData.append('phoneNumber', this.f.phoneNumber.value);
    formData.append('password', this.f.password.value);
    formData.append('confirmPassword', this.f.confirmPassword.value);
    formData.append('Username', this.f.Username.value);
    formData.append('selectparentUser', this.f.selectparentUser.value);
    formData.append('companyName', this.f.companyName.value);
    formData.append('companyLogo', logoBlob, 'logo.png');
    formData.append('companyBanner', bannerBlob, 'banner.png');

    this.authenticationService.addNewUser(formData)
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'User Registered Successfully',
            icon: 'success',
            confirmButtonColor: '#F34335',
            width: '300px',
          });

          this.router.navigate(['/addUser']);
        },
        error: (err) => {
          this.error = 'Error While Adding the User!';
          this.loading = false;
        }
      });


  }
}
