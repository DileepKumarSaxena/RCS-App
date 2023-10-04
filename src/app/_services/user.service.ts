import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/services/base.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }
    baseUrlData = this.baseUrl + 'user/';

    getAll() {
        return this.http.get<any>(`/users`);
    }

    addNewUser(formData: FormData) {
        return this.http.post<any>(this.baseUrlData + 'createUser', formData,);
    }

    updateUserDetails(formData: FormData) {
        return this.http.post<any>(this.baseUrlData + 'update', formData,);
    }

    edituserData(userId: any) {
        return this.http.get(`${this.baseUrlData + 'findByUserId?id=' + userId}`);
    }

    deleteUserById(userId: any): Observable<any> {
        return this.http.delete(`${this.baseUrlData + 'deleteByUserId?id=' + userId}`);
    }

    activeDeactiveUserById(userId: any, active: any): Observable<any> {
        const dynamicApiUrl = `${this.baseUrlData}deactivateUserByUserId?id=${userId}&active=${active == 'N' ? 'N' : 'Y'}`;
        return this.http.get(dynamicApiUrl);
    }

}