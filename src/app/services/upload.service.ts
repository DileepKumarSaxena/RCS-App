import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {}

  upload(file: any, campaignName: any): Observable<any> {

    let headers = new Headers();
    let options = { headers: headers };
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("campaignName", campaignName,);
    return this.http.post("Api/uploadFilehere", formData)
  }

}
