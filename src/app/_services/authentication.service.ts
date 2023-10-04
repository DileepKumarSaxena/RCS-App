import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import jwt_decode from 'jwt-decode'
import { StorageService } from './storage.service';
import { UserModel } from "@app/_models/user-model";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  baseUrl = 'http://fuat.flash49.com/rcsmsg/';
  // baseUrl = 'https://app.flash49.com/rcsmsg/';
  // baseUrl = 'http://172.20.200.103:8172/api/v1/rcsmessaging/' (Use this when LAN is connected)

  constructor(private http: HttpClient, public storage: StorageService) {
    this.currentUserSubject = new BehaviorSubject<any>(

      this.currentUserSubject = JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(this.baseUrl + `auth/generateToken`, { username, password })
      .pipe(
        map(user => {
          user.authdata = user.result.token;

          const decode = jwt_decode(user.authdata);
          // console.log(val, "Value.......");
          if (decode && decode['exp']) {
            let expTime: any = (parseInt(decode['exp']) * 1000);
            expTime = new Date(expTime);
            this.storage.setItem('expireOn', expTime);
            sessionStorage.setItem('expireOn', expTime);
          }

          localStorage.setItem("currentUser", JSON.stringify(user));
          // sessionStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;

        }
        )
      );
  }

  forgetPassword(username: string, email: string) {
    return this.http
      .get<any>(this.baseUrl + 'auth/forgot-password?userName=' + username + "&mail=" + email)
  }

  resetPassword(userId: any, newPassword: any, oldPassword: any) {
    return this.http
      .get<any>(this.baseUrl + 'user/reset-pwd?userId=' + userId + "&oldPassword=" + oldPassword + "&newPassword=" + newPassword)
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSubject.next(null!);
  }

}
