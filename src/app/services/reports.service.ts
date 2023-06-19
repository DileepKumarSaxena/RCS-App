import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }



  detailsReportData(detailsReport: any) {
    var credentials = {
      from_date: detailsReport.from_date,
      to_date: detailsReport.to_date
    }
    return this.http.get(' https://api.instantwebtools.net/v1/airlines');

  }

  summaryReportData(summaryReport:any){
    var credentials = {
      from_date: summaryReport.from_date,
      to_date: summaryReport.to_date
    }
    return this.http.get(' https://api.instantwebtools.net/v1/airlines');

  }
}
