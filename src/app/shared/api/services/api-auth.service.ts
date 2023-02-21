import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IAuthDTO } from '../models/v1/auth';

@Injectable({
    providedIn: 'root',
})
export class ApiAuthService {
    private baseUrl = `${environment.baseApiUrl}/auth`;

    constructor(private http: HttpClient) {
    }

    // public adLogin(): Promise<IAuthDTO> {
    //     return firstValueFrom(this.http.post<IAuthDTO>(`${this.baseUrl}/v1/login`, {}));
    // }

    public loginAsync(contract: {
        email: string,
        password: string
    }): Promise<IAuthDTO> {
        return firstValueFrom(this.http.post<IAuthDTO>(`${this.baseUrl}/v1/login`, contract));
    }

    public refreshAsync(): Promise<IAuthDTO> {
        return firstValueFrom(this.http.post<IAuthDTO>(`${this.baseUrl}/v1/refresh`, {}));
    }
}
