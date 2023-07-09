import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  baseUrlData = this.baseUrl + 'template/';

  templateDataSubmit(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrlData + 'addTemplate'}`, formData );
  }

 
}
