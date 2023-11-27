import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  chaturl = 'https://app.flash49.com/demoRcs/';
  // chaturl = 'https://fuat.flash49.com/demoRcs/';

  fetchUsers(userName: string): Observable<any> {
    const chatUrl = this.chaturl + `findListBasedTextMessageIsNotNull?userName=${userName}`;
    return this.http.post(chatUrl, {});
  }

}
