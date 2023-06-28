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
    return this.http.get(`https://fuat.flash49.com/rcsmsg/template/findAllTemplate`);
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

  getCampaignlistDetails(userId, fromDate, toDate) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("from", fromDate);
    httpParams = httpParams.append("to", toDate);
    httpParams = httpParams.append("userId", userId);
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

}
