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
  private URLS = ' http://fuat.flash49.com/rcsmsg/campaign/campaignNameAndIdListByDateRange';
  dateRangeFilter(from: string, to: string, userId:string): Observable<any> {
    return this.http.get(`${this.URLS}?from=${from}&to=${to}&userId=${userId}`);
  }
  private URLS_Lead = ' http://fuat.flash49.com/rcsmsg/lead/leadNameAndIdList';
  getLeadList(userId:string, campaignId:string): Observable<any> {
    return this.http.get(`${this.URLS_Lead}?userId=${userId}&campaignId=${campaignId}`);
  }
  
  getDeatilReport(username, fromDate, toDate, camType, leadId, limit, start, pageIndex: number, pageSize: number) {
    const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsDetailedSmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      camType:camType,
      clientId: leadId,
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
  getSummaryData(username, fromDate, toDate) {
    const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsSummarySmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: 0,
      role :0,
       camId :0,
    };
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, data, httpOptions);
  }
  getDetailData(username, fromDate, toDate, camType, leadId, limit, start, pageIndex: number, pageSize: number) {
    const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsDetailedSmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      camType:camType,
      clientId: leadId,
      camId: 0,
      role: 0,
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

  

