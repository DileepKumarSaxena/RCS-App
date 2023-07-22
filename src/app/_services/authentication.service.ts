import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";



@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  baseUrl = 'https://fuat.flash49.com/rcsmsg/';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(

      this.currentUserSubject = JSON.parse(localStorage.getItem("currentUser"))
    );

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // post to fake back end, this url will be handled there...

    return this.http
      .post<any>(this.baseUrl + `auth/generateToken`, { username, password })
      .pipe(
        map(user => {

          user.authdata = user.result.token;
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }


  forgetPassword(username: string, email: string) {

    return this.http
      .get<any>(this.baseUrl + 'auth/forgot-password?userName=' + username + "&mail=" + email)
  }

  resetPassword(newPassword: string, userId: string, oldPassword: string) {

    return this.http
      .get<any>(this.baseUrl + 'user/reset-pwd?userId=' + '1' + "&oldpassword=" + oldPassword + "&newPassword=" + newPassword)
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null!);
    this.router.navigate(['/login']);
    //login redirect
  }

}
