import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from 'src/app/_services';
import { first } from 'rxjs/operators';
// import { User } from '../../_models';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  loading = false;
  users: any;
  currentUser: any;
  lastLogin: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.lastLogin = localStorage.getItem('lastLogin');
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
