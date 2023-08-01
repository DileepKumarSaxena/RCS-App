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
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.showDropdown = false;
    }
  }
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
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }
  
  // isResetPage(): boolean {
  //   return this.router.url === '/reset/password';
    
  // }

  resetPassword(){
    this.router.navigate(['/reset/password'])
  }
}
