import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  constructor(private http:HttpClient) { }

  
  getLeadlistDetails(id:any){
    return this.http.get("http://fakeapi.gettingdataintable/lead", id)
    
  }
}
