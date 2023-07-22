import { Injectable } from '@angular/core';
import { BaseService } from './base.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  baseUrlData = this.baseUrl + 'report/';


  //Api for Detail_Report

  getDeatilReport(username, fromDate, toDate) {
    const url = this.baseUrlData + 'getRcsDetailedSmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: "0"
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, data, httpOptions);
  }


  //Api for Summary_Report

  getSummaryReport(username, fromDate, toDate) {
    const url = this.baseUrlData + 'getRcsSummarySmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: "0"
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, data, httpOptions);
  }

}



