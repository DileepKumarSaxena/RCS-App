import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReportsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  baseUrlData = this.baseUrl + 'report/';
  campUrlData = this.baseUrl + 'campaign/';
  leadUrlData = this.baseUrl + 'lead/';

  //Api for Detail_Report
  // private URLS = this.campUrlData+'campaignNameAndIdListByDateRange';
  // private URLS = this.campUrlData+'campaignNameAndIdListByDateRange';
  private URLS = this.leadUrlData + 'getLeadAndCampaignNameWithIds';
  dateRangeFilter(from: string, to: string, userId: string): Observable<any> {
    return this.http.get(`${this.URLS}?from=${from}&to=${to}&userId=${userId}`);
  }

  private URLS_Lead = this.leadUrlData + 'leadNameAndIdList';
  // private URLS_Lead = this.leadUrlData+'leadNameAndIdList';
  getLeadList(userId: string, campaignId: string): Observable<any> {
    return this.http.get(`${this.URLS_Lead}?userId=${userId}&campaignId=${campaignId}`);
  }

 getDeatilReport(userName, fromDate, toDate, camType, leadId, limit, start, pageIndex: number, pageSize: number) {
  const url = this.baseUrlData + 'getRcsDetailedSmsReport';
  const storedUserName = sessionStorage.getItem('username'); // Retrieve username from sessionStorage

  const data = {
    username: userName || storedUserName, // Use selected username or the one from sessionStorage
    fromDate: fromDate,
    toDate: toDate,
    camType: camType != null ? camType : '0',
    clientId: '0',
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


  getSummaryData(userName, fromDate, toDate) {
    const url = this.baseUrlData + 'getRcsSummarySmsReport';
    const storedUserName = sessionStorage.getItem('username'); // Retrieve username from sessionStorage

    const data = {
   
      fromDate: fromDate,
      toDate: toDate,
      username: userName || storedUserName,

      clientId: 0,
      role: 0,
      camId: 0,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, data, httpOptions);
  }

  getSummaryDataHourlyBasis(username, fromDate, toDate) {
    const url = this.baseUrlData + 'getRcsSummarySmsReport';
    if (username == null) {
      // Retrieve the username from sessionStorage, replace 'sessionStorageKey' with the actual key you use
      const Username = sessionStorage.getItem('username');
  
      // If a username is found in sessionStorage, use it
      if (Username) {
        username = Username;
      }
    }
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      action: 'HOURLY',
      clientId: 0,
      role: 0,
      camId: 0,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, data, httpOptions);
  }

  getSummaryDataSearch(username, fromDate, toDate) {
    const url = this.baseUrlData + 'getRcsSummarySmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: username,
      clientId: 0,
      role: 0,
      camId: 0,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, data, httpOptions);
  }

  getDetailData(userName, fromDate, toDate, camType, leadId, limit, start, pageIndex: number, pageSize: number) {
    const url = this.baseUrlData + 'getRcsDetailedSmsReport';
    const storedUserName = sessionStorage.getItem('username');
    // const url = 'http://fuat.flash49.com/rcsmsg/report/getRcsDetailedSmsReport';
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: userName || storedUserName,
      camType: camType != null ? camType : '0',
      clientId: leadId != null ? leadId : '0',
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
  getSummaryReport(userName, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    const url = this.baseUrlData + 'getRcsSummarySmsReport';
    const storedUserName = sessionStorage.getItem('username'); 
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      username: userName || storedUserName,
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

}