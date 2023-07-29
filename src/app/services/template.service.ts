import { HttpClient, HttpParams } from '@angular/common/http';
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

  getTemplatelistDetails(templateUserId, limit, start, pageIndex: number, pageSize: number ) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("limit", limit);
    httpParams = httpParams.append("start", start);
    httpParams = httpParams.append("templateUserId", templateUserId);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllTemplate'}`, { params: httpParams });
  }
 
  getTemplateData(templateUserId, limit, start, pageIndex: number, pageSize: number ) {
    let httpParams = new HttpParams()
    httpParams = httpParams.append("limit", 0);
    httpParams = httpParams.append("start", 0);
    httpParams = httpParams.append("templateUserId", templateUserId);
    httpParams = httpParams.append("pageIndex", pageIndex.toString());
    httpParams = httpParams.append("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrlData + 'findAllTemplate'}`, { params: httpParams });
  }
}
