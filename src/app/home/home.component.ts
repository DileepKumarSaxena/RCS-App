import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

// import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';

@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']

 })
export class HomeComponent {
    loading = false;
    users: any;
    currentUser:any;
    constructor(
        private userService: UserService,
        private router: Router,
        private authenticationService: AuthenticationService
        ) {
             this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
         }

    ngOnInit() {
        this.loading = true;
        // this.userService.getAll().pipe(first()).subscribe(users => {
        //     this.loading = false;
        //     this.users = users;
        // });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}