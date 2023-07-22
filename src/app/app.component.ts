import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
// import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FonadaRCS';

  currentUser: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }


  isResetPage(): boolean {
    return this.router.url === '/reset/password';
    
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  resetPassword(){
    this.router.navigate(['/reset/password'])
  }
}
