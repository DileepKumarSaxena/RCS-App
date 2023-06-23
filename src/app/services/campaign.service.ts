import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private http: HttpClient) { }

  private existingCampaignsEndpoint = 'https://fuat.flash49.com/rcsmsg/campaign/findCampaignByCampaignNameAndUserId';
 
  getAllTheCampaignList(userId: any, campaignName: any): Observable<any> {
    const url = `${this.existingCampaignsEndpoint}?userId=${userId}&campaignName=${campaignName}`;
    return this.http.get(url).pipe(map(response=>response));
  }

  // Message Types
  private messageType = "https://fuat.flash49.com/rcsmsg/campaign/messageTypes";

  getAllTheMessageTypesList(): Observable<any> {
    return this.http.get(`${this.messageType}`)
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

  campaignDataSubmit(formData: any): Observable<any> {
    return this.http.post("https://fuat.flash49.com/rcsmsg/campaign/createCampaign", formData)
  }

  getCampaignlistDetails(userId, fromDate, toDate) {
    let apiUrl = "https://fuat.flash49.com/rcsmsg/campaign/findAllCapmaingList?from=";
    return this.http.get(apiUrl + fromDate + "&to=" + toDate + "&userId=" + userId);
  }

  private editCampaign = " https://fuat.flash49.com/rcsmsg/campaign/campaignListing";
  editCampaignById(campaignId: any): Observable<any> {
    const url = `${this.editCampaign}?Id=${campaignId}`;
    return this.http.delete(url).pipe(map(response=>response));
  }

  private deleteCampaign = " https://fuat.flash49.com/rcsmsg/campaign/deleteCampaignById";
  deleteCampaignById(campaignId: any): Observable<any> {
    const url = `${this.deleteCampaign}?Id=${campaignId}`;
    return this.http.delete(url).pipe(map(response=>response));
  }

}
