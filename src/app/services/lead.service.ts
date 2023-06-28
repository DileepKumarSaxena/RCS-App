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

  leadDataSubmit(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'leadInfo'}`, formData);
  }

  getLeadlistDetails(userId, fromDate, toDate) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("from", fromDate);
    httpParams = httpParams.append("to", toDate);
    httpParams = httpParams.append("userId", userId);
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
    let userId = 1;
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
  
}
