import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { GLOBAL_CONSTANTS } from '../constants';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.authdata) {
        request = request.clone({
            setHeaders: { 
                Authorization: `Bearer ${currentUser.authdata}`
            }
        });
    }
    return next.handle(request);
  }
}
