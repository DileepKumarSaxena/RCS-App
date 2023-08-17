import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service'
@Injectable({
  providedIn: 'root'
})
export class AddUserService extends BaseService{
  baseUrlData = this.baseUrl + 'user/';
  constructor(private http: HttpClient) {
    super();
   }

   downloaduserlist(username, fromDate, toDate) {
    const url = this.baseUrlData+'Adduser';
    // const url = this.baseUrlData+'getRcsSummarySmsReport';
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


  getUserReport(username, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    const url = this.baseUrlData+'Adduser';
    // const url = 'https://app.flash49.com/rcsmsg/report/getRcsSummarySmsReport';
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
}
