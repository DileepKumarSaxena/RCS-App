import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  baseUrlData = this.baseUrl + 'report/';


  getDetailReports() {
    return this.http.get(`${this.baseUrlData + 'getRcsDetailedSmsReport'}`);
  }

}
