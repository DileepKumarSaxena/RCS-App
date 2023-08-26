import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/services/base.service';
import { Observable } from 'rxjs';

// import { User } from '../_models';

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
        return this.http.post<any>(this.baseUrlData + 'createUser', formData, );
    }
    

    edituserData(id: any) {
        return this.http.get(`${this.baseUrlData + 'finduserById?Id=' + id}`);
    }

    deleteUserById(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrlData + 'deleteUserById?Id=' + id}`);
    }
}