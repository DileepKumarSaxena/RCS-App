import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    lastLogin: string;
    token: string;
    loggedInUsername: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        // Set the last login time to the current time
        this.lastLogin = new Date().toLocaleString();
        // // Store the last login time in local storage
        localStorage.setItem('lastLogin', this.lastLogin);
        // localStorage.setItem('token', this.token);
        // localStorage.setItem('username', this.loggedInUsername);
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            // .pipe(first())
            .subscribe({

                next: (res) => {
                    console.log(res, "Data===>");
                    this.router.navigate(['/vircs']);

                },
                error: (err) => {
                    console.log(err, "err===>");
                    this.error = ('Username or password is incorrect');
                    this.loading = false;
                }
            })
    }
}
