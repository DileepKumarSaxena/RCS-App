import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  baseUrlData = this.baseUrl + 'report/';


  //Api for Detail_Report

  getDeatilReport(username, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsDetailedSmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: "0",
      camId: limit,
      role: start,
      pageIndex: pageIndex,
      pageSize: pageSize
      
    };
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, data, httpOptions);
  }

  // getDeatilReport(username, fromDate, toDate, clientId, limit, start, pageIndex: number, pageSize: number ) {
  //   let httpParams = new HttpParams()
  //   httpParams = httpParams.append("username", username);
  //   httpParams = httpParams.append("fromDate", fromDate);
  //   httpParams = httpParams.append("toDate", toDate);
  //   httpParams = httpParams.append("clientId", clientId);
  //   httpParams = httpParams.append("limit", limit);
  //   httpParams = httpParams.append("start", start);
  //   httpParams = httpParams.append("pageIndex", pageIndex.toString());
  //   httpParams = httpParams.append("pageSize", pageSize.toString());
  
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     }),
  //     params: httpParams
  //   };
  
  //   return this.http.get(`${this.baseUrlData}getRcsDetailedSmsReport`, httpOptions);
  // }
  
  
//Api for Summary_Report

  getSummaryReport(username, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsSummarySmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: "0",
      camId: limit,
      role: start,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, data, httpOptions);
  }
  

    //  const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // };

    //  formData.append("role", " "); 
    //  formData.append("campId", ""); 
    //  formData.append("campType", ""); 
    //  formData.append("vmn", ""); 
    //  formData.append("msisdn", ""); 
    //  formData.append("action", ""); 
 

  }

    // getSummaryReport(username, fromDate, toDate) {
    

  //   let formData = new FormData()
  //    formData.append("fromDate", fromDate);
  //    formData.append("toDate", toDate);
  //    formData.append("username", username);  
  //    formData.append("clientId", "0"); 


  //    return this.http.post('https://fuat.flash49.com/rcsmsg/report/getRcsSummarySmsReport',formData );

  

