
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services/authentication.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword:['', Validators.required],
      userId: [],

      newPassword: [ '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ],

      confirmPassword: ['', [Validators.required]],
    },
    {
      validator: this.passwordMatchValidator
    });
    
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ mustMatch: true });
    } else {
      formGroup.get('confirmPassword').setErrors(null);
    }
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      this.error = ('New Password must contain more than 8 characters, 1 upper case letter, and 1 special character');
      return;
    }

    this.loading = true;

    this.authenticationService.resetPassword(sessionStorage.getItem('userId'), this.f.newPassword.value, this.f.oldPassword.value, )
      // .pipe(first())
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Reset Password Successfully',
            icon: 'success',
            confirmButtonColor: '#F34335',
            width: '300px',
          })
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        },

        error: (err) => {
          this.error = ('Old Password is Not Valid!');
          this.loading = false;
        }
      })
  }

}

