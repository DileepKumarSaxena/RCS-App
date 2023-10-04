import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Role } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // Check if route is restricted by role
            if (next.data.roles && next.data.roles.includes(Role.Admin)) {
                // Check if the user's userId is 1
                if (currentUser.userId === 1) {
                    // Authorized, so return true
                    return true;
                } else {
                    // User is not authorized, show a message and redirect to another route
                    Swal.fire('You are not authorized to access this content. Please contact the administrator!');
                    this.router.navigate(['/']);
                    return false;
                }
            }
            // If the route does not require admin role, allow access
            return true;
        }
        // Not logged in, so redirect to the login page with the return URL
        this.router.navigate(['/login']);
        return false;
    }

}


