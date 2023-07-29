import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CampaignService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  baseUrlData = this.baseUrl + 'campaign/';

  getAllTheCampaignList(userId: any, campaignName: any): Observable<any> {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("userId", userId);
    httpParams = httpParams.append("campaignName", campaignName);
    return this.http.get(`${this.baseUrlData + 'findCampaignByCampaignNameAndUserId'}`, { params: httpParams });
  }

  // Message Types
  getAllTheMessageTypesList(): Observable<any> {
    return this.http.get(`${this.baseUrlData + 'messageTypes'}`);
  }

  private messageListSubject$ = new BehaviorSubject(null);

  getMessageList(): Observable<any> {
    return this.messageListSubject$.asObservable();
  }
  setMessageList() {
    this.getAllTheMessageTypesList().subscribe((res) => {
      return this.messageListSubject$.next(res);
    });
  }

  // Template List
  getAllTemplateList(): Observable<any> {
    return this.http.get('http://fuat.flash49.com/rcsmsg/template/getAllTemplateName?templateUserId='+sessionStorage.getItem('userId'));
  }

  private templateListSubject$ = new BehaviorSubject(null);

  getTemplateList(): Observable<any> {
    return this.templateListSubject$.asObservable();
  }
  setTemplateList() {
    this.getAllTemplateList().subscribe((res) => {
      return this.templateListSubject$.next(res);
    });
  }

  
  campaignDataSubmit(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'createCampaign'}`, formData);
  }

  // getCampaignlistDetails(userId, fromDate, toDate, pageIndex, pageSize) {
  //   let httpParams = new HttpParams()
  //   httpParams = httpParams.append("from", fromDate);
  //   httpParams = httpParams.append("to", toDate);
  //   httpParams = httpParams.append("userId", userId);
  //   httpParams = httpParams.append("start", (pageIndex * pageSize).toString())
  //   httpParams= httpParams.append("limit", pageSize.toString());

  //   console.log(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams }, "CampAPI");
  //   return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
  // }

  //http://fuat.flash49.com/rcsmsg/campaign/findAllCapmaingList?from=2023-07-24&to=2023-07-24&userId=1&start=0&limit=5 

  //http://fuat.flash49.com/rcsmsg/campaign/findAllCapmaingList?userId=1&startDate=2023-07-24&endDate=2023-07-24&limit=5&start=0

  getCampaignlistDetails(userId: any, startDate: string, endDate: string, limit, start, pageIndex: number, pageSize: number): Observable<any> {
    let httpParams = new HttpParams()
    .append("from", startDate)
    .append("to", endDate)
      .append("userId", userId)
      .append("limit", limit)
      .append("start", start)
      httpParams = httpParams.append("pageIndex", pageIndex.toString());
      httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
    
  }

  campaignDataUpdate(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'updateCampaign'}`, formData);
  }

  deleteCampaignById(campaignId: any): Observable<any> {
    return this.http.delete(`${this.baseUrlData + 'deleteCampaignById?Id=' + campaignId}`);
  }

  getCampaignData(campaignId: any) {
    return this.http.get(`${this.baseUrlData + 'findCampaignById?Id=' + campaignId}`);
  }

  // getData(startDate: string, endDate: string): Observable<any> {
  //   let httpParams = new HttpParams()
  //   .append("from", startDate)
  //   .append("to", endDate)
  //     .append("userId", 1)
  //     .append("start", 0)
  //     .append("limit", 0)
    
  //   return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
    
  // }

  getData(startDate: string, endDate: string,userId): Observable<any> {
    let httpParams = new HttpParams()
    .append("from", startDate)
    .append("to", endDate)
      .append("userId", userId)
      .append("start", 0)
      .append("limit", 0)
    
    return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
    
  }

}
