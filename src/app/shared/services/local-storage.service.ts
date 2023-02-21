import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import * as dayjs from 'dayjs';

import { IAuthDTO } from '../api/models/v1/auth';
import { IUserBasketDTO } from '../api/models/v1/user-basket';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public auth = new AuthLocalStorage(this.platformId);
    public redirect = new RedirectLocalStorage(this.platformId);
    public basket = new BasketLocalStorage(this.platformId);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }
}

export class AuthLocalStorage {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }

    public get(): IAuthDTO | null {
        if (isPlatformBrowser(this.platformId)) {
            return {
                token: localStorage.getItem('LoginToken') ?? '',
                expiresDateTime: localStorage.getItem('LoginExpireDate') ? dayjs(localStorage.getItem('LoginExpireDate')).toDate() : new Date()
            };
        }

        return null;
    }

    public set(value: IAuthDTO): void {
        if (isPlatformBrowser(this.platformId)) {
            if (value.token) localStorage.setItem('LoginToken', value.token);
            if (value.expiresDateTime) localStorage.setItem('LoginExpireDate', dayjs(value.expiresDateTime).format('YYYY-MM-DDTHH:mm:ss'));
        }
    }

    public clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('LoginToken');
            localStorage.removeItem('LoginExpireDate');
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

export class BasketLocalStorage {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }

    public get(): IUserBasketDTO[] {
        if (isPlatformBrowser(this.platformId)) {
            const sBasket = localStorage.getItem('Basket');
            if (sBasket) {
                return JSON.parse(sBasket);
            }
        }
        return [];
    }

    public set(value: IUserBasketDTO[]): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('Basket', JSON.stringify(value));
        }
    }

    public clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('Basket');
        }
    }
}

