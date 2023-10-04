import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public apiUrl: string;
  public baseUrl: string;
  public isProduction: boolean = environment.production;

  constructor() {
    // this.apiUrl = environment.apiUrl;
    this.baseUrl = environment.baseUrl;
  }
}
