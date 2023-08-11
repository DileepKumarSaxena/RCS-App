import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'
import { Template } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  baseUrlData = this.baseUrl + 'template/';



  templateDataSubmit(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'addTemplate'}`, formData );
  }

  getTemplatelistDetails(templateUserId, limit, start,fromDate, toDate,templateName, templateStatus, pageIndex: number, pageSize: number ) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("limit", limit);
    httpParams = httpParams.append("start", start);
    httpParams = httpParams.append("from",fromDate);
    httpParams = httpParams.append("to",toDate);
    if(templateName!=null){
      httpParams = httpParams.append("templateCode", templateName);
    }
    if(templateStatus!=null){
    httpParams = httpParams.append("status", templateStatus);
    }
    httpParams = httpParams.append("templateUserId", templateUserId);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllTemplate'}`, { params: httpParams });
  }
 
  getTemplateData(templateUserId, limit, start,fromDate, toDate, templateName, templateStatus, pageIndex: number, pageSize: number ) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("limit", 0);
    httpParams = httpParams.append("start", 0);
    httpParams = httpParams.append("from",fromDate);
    httpParams = httpParams.append("to",toDate);
    if(templateName!=null){
      httpParams = httpParams.append("templateCode", templateName);
    }
    if(templateStatus!=null){
    httpParams = httpParams.append("status", templateStatus);
    }
    httpParams = httpParams.append("templateUserId", templateUserId);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllTemplate'}`, { params: httpParams });
  }

  private URLS = this.baseUrlData+'getAllTemplateNameAndIdWithDateFilter';
  dateRangeFilter(from: string, to: string, UserId:string): Observable<any> {

    return this.http.get(`${this.URLS}?from=${from}&to=${to}&templateUserId=${+sessionStorage.getItem('userId')}`);
  }


  getTemplateSearchReport(templateUserId, limit, start,fromDate, toDate,templateName, templateStatus, pageIndex: number, pageSize: number) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("limit", limit);
    httpParams = httpParams.append("start", start);
    httpParams = httpParams.append("from",fromDate);
    httpParams = httpParams.append("to",toDate);
    if(templateName!=null){
      httpParams = httpParams.append("templateCode", templateName);
    }
    if(templateStatus!=null){
    httpParams = httpParams.append("status", templateStatus);
    }
    httpParams = httpParams.append("templateUserId", templateUserId);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllTemplate'}`, { params: httpParams });
      
    };
  
  
}
