import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '@app/_services';
import { BaseService } from '@app/services/base.service';
import { AlertService } from '@app/services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  baseUrlData: string = '';
  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private baseService: BaseService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let httpHeaders = new HttpHeaders();
    this.baseUrlData = this.baseService.baseUrl + 'template/';
    if (request.url.includes(`${this.baseUrlData + 'addTemplate'}`)) {
      httpHeaders = httpHeaders.set('enctype', 'multipart/form-data');
      httpHeaders = httpHeaders.set('Cache-Control', 'no-cache');
      httpHeaders = httpHeaders.set('Pragma', 'no-cache');
    } else {
      httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    }
    request = request.clone({ headers: httpHeaders });
    console.log("request-error: ", request)
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if ([HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].indexOf(error.status) !== -1) {
            this.unauthorized();
            return throwError(() => '');
          } else {
            if (error?.error && error?.error?.status === HttpStatusCode.InternalServerError) {
              this.alertService.successToaster(this.getErrorMessages(HttpStatusCode.Unauthorized));
              return throwError(() => '');
            } else if (error?.error?.status) {
              return throwError(() => error?.error?.message);
            } else {
              return throwError(() => '');
            }
          }
        })
      )
  }

  unauthorized(): void {
    this.alertService.successToaster(this.getErrorMessages(HttpStatusCode.Unauthorized));
    this.authenticationService.logout();
  }

  getErrorMessages(status: number): string {
    switch (status) {
      case HttpStatusCode.Unauthorized:
        return 'test error';
      case HttpStatusCode.InternalServerError:
        return 'test error';
      default:
        return 'test error';
    }
  }

}
