import { Injectable } from '@angular/core';
import { BaseService } from './base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  baseUrlData = this.baseUrl + 'blacklist/';

  uploadBlackListData(userId:any, file: any): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.http.post(`${this.baseUrlData}uploadBlackListNo?userId=${userId}`, formData);
  }
  

   submitBlackListData(userId:any, phoneNumber:any) {
    return this.http.post(this.baseUrlData + "generateBlacklistNo", {userId, phoneNumber});
  }

  
  searchBlackListDetails(userId: any, msisdn: any) {
    return this.http.get(`${this.baseUrlData}findByMsisdnAndClientid?userId=${userId}&msisdn=${msisdn}`);
  }
  

  deleteBlacklist(id: any): Observable<any> {
    return this.http.get(`${this.baseUrlData}deleteByMsisdnAndUserId?id=${id}`);
  }

  findAllBlackListNoByUserId(userId: any) {
    return this.http.get(`${this.baseUrlData}findAllBalckListNoByUserId?userId=${userId}`);
  }
  

}


