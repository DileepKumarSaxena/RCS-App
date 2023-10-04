import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public isReloadEnable = false;
  //Setting Simple Key value
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  //Getting Simple Key value
  getItem(key: string) {
    return localStorage.getItem(key);
  }
  //Setting Json Object
  setJsonItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  //Getting Json Object
  getJsonItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  deleteItem(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }

  setSession(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  getSession(key: string) {
    return sessionStorage.getItem(key);
  }

  clearSession(key: string) {
    sessionStorage.removeItem(key);
  }

  clearAllSession() {
    sessionStorage.clear();
  }

}
