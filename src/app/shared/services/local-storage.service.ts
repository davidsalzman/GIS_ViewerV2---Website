import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import * as dayjs from 'dayjs';

import { IAuthDTO } from '../api/models/v1/auth';


@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public auth = new AuthLocalStorage(this.platformId);
    public redirect = new RedirectLocalStorage(this.platformId);
    

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }
}

export class AuthLocalStorage {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }

    public get(): IAuthDTO | null {
        if (isPlatformBrowser(this.platformId)) {
            return {
                token: localStorage.getItem('Pay360LoginToken') ?? '',
                expiresDateTime: localStorage.getItem('Pay360LoginExpireDate') ? dayjs(localStorage.getItem('Pay360LoginExpireDate')).toDate() : new Date()
            };
        }

        return null;
    }

    public set(value: IAuthDTO): void {
        if (isPlatformBrowser(this.platformId)) {
            if (value.token) localStorage.setItem('Pay360LoginToken', value.token);
            if (value.expiresDateTime) localStorage.setItem('Pay360LoginExpireDate', dayjs(value.expiresDateTime).format('YYYY-MM-DDTHH:mm:ss'));
        }
    }

    public clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('Pay360LoginToken');
            localStorage.removeItem('Pay360LoginExpireDate');
        }
    }
}

export class RedirectLocalStorage {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }

    public get(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('Redirect');
        }
        return null;
    }

    public set(value: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('Redirect', value);
        }
    }

    public clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('Redirect');
        }
        
    }
}



