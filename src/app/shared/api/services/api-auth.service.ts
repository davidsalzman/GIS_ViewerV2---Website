import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import moment from 'moment';
import { environment } from '../../../../environments/environment';
import { IAuthDTO } from '../models/v1/auth';

@Injectable({
    providedIn: 'root',
})
export class ApiAuthService {
    private baseUrl = `${environment.baseAdApiUrl}/auth`;
    private baseApiUrl = `${environment.baseApiUrl}/auth`;

    constructor(private http: HttpClient) {
    }

    /**
     * Using the current auth token gets a new token
     * @returns Auth token
     */
    public refreshToken(): Promise<IAuthDTO> {
        return firstValueFrom(this.http.post<IAuthDTO>(`${this.baseApiUrl}/v1/refresh`, {}));
    }

    /**
     * Attempts to login the current user using their AD
     */
    public login(): Promise<IAuthDTO> {
        return firstValueFrom(this.http.get<IAuthDTO>(`${this.baseUrl}/v1/login/${this.getUniId()}`, { withCredentials: true }));
    }

    private getUniId(): string {
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        id += moment().format('YYYYMMDD') + moment().format('Hmmss');
        return id;
    }
}



