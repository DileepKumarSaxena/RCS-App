import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services/authentication.service';
import Swal from 'sweetalert2';
import { AUTH_LOGO, AUTh_IMG } from '@app/Constants/image-constant';
import { GLOBAL_CONSTANTS } from '@app/Constants/global-constant';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  authlogo: string = AUTH_LOGO;
  authImg: string = AUTh_IMG;
  errorMessage = GLOBAL_CONSTANTS.ERROR.validationError.common;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: ['', Validators.required],
    });
  }

  get f() { return this.forgetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.forgetPassword(this.f.username.value, this.f.email.value)
      // .pipe(first())
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Password Sent To Given Mail',
            icon: 'success',
            confirmButtonColor: '#F34335',
            width: '300px',
          })
          this.router.navigate(['/login']);
        },

        error: (err) => {
          // console.log(err, "err===>");
          // this.error = ('Username or Email is incorrect');
          // this.loading = false;

          if (err.status === 404) {
            this.error = 'Username or Email is incorrect';
          } else {
            this.error = 'Something went wrong. Please try again later.';
          }
          this.loading = false;
        }
      })
  }

  onCancel() {
    this.forgetPasswordForm.get('email').setValue('');
  }

}


