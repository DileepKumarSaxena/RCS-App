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

  //Compaign Name List

  // private existingCampaignsEndpoint='https://fuat.flash49.com/rcsmsg/campaign/findCampaignByCampaignNameAndUserId?campaignName=';
  private existingCampaignsEndpoint = 'https://fuat.flash49.com/rcsmsg/campaign/campaignListing?userId=1';

  getAllTheCampaignList(): Observable<any> {
    return this.http.get(`${this.existingCampaignsEndpoint}`)
  }
  checkCampaignName(campaignName): Observable<any> {
    return this.http.get(`${this.existingCampaignsEndpoint + campaignName + '&userId=1'}`)
      .pipe(
        map(response => response)
      );
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

  getCampaignlistDetails() {
    //return this.http.get("https://fuat.flash49.com/rcsmsg/campaign/findAllCapmaingList?from=2023-05-01&to=2023-06-09&userId=1");
   
    let fromDate = "2023-05-01";
    let toDate = "2023-06-09";
    let userId = 1;
    let apiUrl = "https://fuat.flash49.com/rcsmsg/campaign/findAllCapmaingList?from=";
    console.log(apiUrl + fromDate + "&to=" + toDate + "&userId=" + userId, 'apiUrl');
    return this.http.get(apiUrl + fromDate + "&to=" + toDate + "&userId=" + userId);

    // let apiUrl = "https://fuat.flash49.com/rcsmsg/campaign/campaignListing?userId=";
    // return this.http.get(apiUrl + 1);

  }

}
