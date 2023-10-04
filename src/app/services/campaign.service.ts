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
  templateUrlData = this.baseUrl + 'template/';
  leadUrlData = this.baseUrl + 'lead/';

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
    return this.http.get(this.templateUrlData + 'getAllTemplateName?templateUserId=' + sessionStorage.getItem('userId'));
    // return this.http.get(this.templateUrlData+'getAllTemplateName?templateUserId='+sessionStorage.getItem('userId'));
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

  getCampaignlistDetails(userId: any, startDate: string, endDate: string, templateName, campaignName,userName, limit, start, pageIndex: number, pageSize: number): Observable<any> {
    let httpParams = new HttpParams()
      .append("from", startDate)
      .append("to", endDate)
      .append("limit", limit)
      .append("start", start)
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    if (templateName != null) {
      httpParams = httpParams.append("templateId", templateName);
    }
    if (campaignName != null) {
      httpParams = httpParams.append("campaignId", campaignName);
    }
    if (userName === null) {
      httpParams = httpParams.append("userId", userId);
      }

    if (userName != null) {
      httpParams = httpParams.append("userId", userName);
      }
    return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
  }

  campaignDataUpdate(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'updateCampaign'}`, formData);
  }

  deleteCampaignById(campaignId: any): Observable<any> {
    return this.http.delete(`${this.baseUrlData + 'deleteCampaignById?Id=' + campaignId}`);
  }

  activeDeactiveCampaignById(campaignId: any, status: any): Observable<any> {
    const dynamicApiUrl = `${this.baseUrlData}deleteCampaignById?Id=${campaignId}&status=${status == 'Active' ? 0 : 1}`;
    return this.http.delete(dynamicApiUrl);
  }

  getCampaignData(campaignId: any) {
    return this.http.get(`${this.baseUrlData + 'findCampaignById?Id=' + campaignId}`);
  }

  getData(startDate: string, endDate: string, userId, templateName: string, campaignName: string,userName): Observable<any> {
    let httpParams = new HttpParams()
      .append("from", startDate)
      .append("to", endDate)
      .append("start", 0)
      .append("limit", 0);
      if(userName===null){
        httpParams = httpParams.append("userId", userId)
      }
    if (templateName != null) {
      httpParams = httpParams.append("templateId", templateName);
    }
    if (campaignName != null) {
      httpParams = httpParams.append("campaignId", campaignName);
    }

    if (userName != null) {
      httpParams = httpParams.append("userId", userName);
      }

    return this.http.get(`${this.baseUrlData + 'findAllCapmaingList'}`, { params: httpParams });
  }

  private URLS = this.templateUrlData + 'getAllTemplateNameAndIdWithDateFilter';
  dateRangeFilter(from: string, to: string, templateId: string): Observable<any> {

    return this.http.get(`${this.URLS}?from=${from}&to=${to}&templateUserId=${+sessionStorage.getItem('userId')}`);
  }

  private URLS_camp = this.baseUrlData + 'campaignListing';
  // private URLS = this.campUrlData+'campaignNameAndIdListByDateRange';
  getCampaignList(userId: string, templateName: string): Observable<any> {
    return this.http.get(`${this.URLS_camp}?userId=${userId}&templateId=${templateName}`);
  }
}
