import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {AuthenticationService} from './authentication.service'

@Injectable({
  providedIn: 'root'
})
export class JwtService  {

  constructor(
    protected http: HttpClient,
    public storage: StorageService,
    private authenticationService:AuthenticationService) {
  }

  async checkTokenExpTime() {
    const expiresOn = this.storage.getItem('expireOn');
    const timeDiff = (new Date(expiresOn).valueOf() - new Date().valueOf()) / 1000 ;
    console.log(timeDiff, "timeDiff.......");
    if (expiresOn && (timeDiff <= 0)) {
      this.authenticationService.logout();
      location.reload();
    }
  }

}