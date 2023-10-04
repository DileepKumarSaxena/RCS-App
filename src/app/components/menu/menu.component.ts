import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '@app/_services';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  showDropdown = false;
  setTimeValue: any;
  currentUser: any;
  userId: string

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private jwtserivce: JwtService,
    
  )
   {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
    this.setTimeIntervalToken();
   
  }

  setTimeIntervalToken() {
    this.setTimeValue = setInterval(() => {
      console.log("Login time.......");
      this.jwtserivce.checkTokenExpTime()
    }, 60000)
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.showDropdown = false;
    }
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

  resetPassword() {
    this.router.navigate(['/change/password'])
  }
  
}


