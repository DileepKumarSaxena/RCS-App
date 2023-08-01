import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class LeadService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  baseUrlData = this.baseUrl + 'lead/';

  getAllTheLeadList(leadName: any): Observable<any> {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("leadName", leadName);
    return this.http.get(`${this.baseUrlData + 'checkIfLeadNameExists'}`, { params: httpParams });
  }


  private URLS = 'http://fuat.flash49.com/rcsmsg/lead/action';
  // private URLS = 'https://app.flash49.com/rcsmsg/lead/action';
  performActionOnLead(leadId: string, action: string): Observable<any> {
    console.log(this.URLS, 'performActionOnLead');
    return this.http.get(`${this.URLS}?action=${action}&leadId=${leadId}`);
  }


  leadDataSubmit(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'leadInfo'}`, formData);
  }

  getLeadlistDetails(userId, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("from", fromDate);
    httpParams = httpParams.append("to", toDate);
    httpParams = httpParams.append("userId", userId);
    httpParams = httpParams.append("limit", limit);
    httpParams = httpParams.append("start", start);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'leadInfoList'}`, { params: httpParams });
  }

  leadDataUpdate(formData: any): Observable<any> {
    return this.http.put(`${this.baseUrlData + 'updateLead'}`, formData);
  }

  deleteLeadById(leadId: any): Observable<any> {
    return this.http.delete(`${this.baseUrlData + 'deleteLeadById?Id=' + leadId}`);
  }

  getLeadData(leadId: any) {
    return this.http.get(`${this.baseUrlData + 'findByLeadInfoId?leadId=' + leadId}`);
  }

  // Campaign Name List
  getAllTheCampaignTypesList(userId:any): Observable<any> {
    return this.http.get(`${this.baseUrl +  'campaign/campaignListing?userId=' + userId}`);
  }
  private campaignListSubject$ = new BehaviorSubject(null);

  getCampaignList(): Observable<any> {
    return this.campaignListSubject$.asObservable();
  }
  setCampaignList() {
    let userId = sessionStorage.getItem('userId');
    this.getAllTheCampaignTypesList(userId).subscribe((res) => {
      return this.campaignListSubject$.next(res);
    });
  }

  uploadCSVFile(leadInfoJson: any, file:any, isDND: any, isDuplicate: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append("isDND", isDND);
    httpParams = httpParams.append("isDuplicate", isDuplicate);
    console.log(leadInfoJson, "leadInfoJson");
    let formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("leadInfoJson", JSON.stringify(leadInfoJson));
    return this.http.post(`${this.baseUrlData + 'leadInfo/upload'}`, formData, { params: httpParams });
  }

  testNumber(isDND: any, formObj:any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append("isDND", isDND);
    console.log(formObj, "data..............");
    return this.http.post(`${this.baseUrlData + 'leadInfo'}`, formObj, { params: httpParams });
  }
  
  getLeadListData(userId, fromDate, toDate, limit, start, pageIndex: number, pageSize: number) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("from", fromDate);
    httpParams = httpParams.append("to", toDate);
    httpParams = httpParams.append("userId", userId);
    httpParams = httpParams.append("limit", 0);
    httpParams = httpParams.append("start", 0);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'leadInfoList'}`, { params: httpParams });
  }
}
