import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api/api.service';
import { LocalStorageService } from './local-storage.service';

import { IUserDTO } from '../api/models/v1/user';

dayjs.extend(utc);

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public user$: Observable<IUserDTO | null>;
    private userSubject: Subject<IUserDTO | null>;
    private _user: IUserDTO | null = null;

    private timeout: any;

    constructor(private api: ApiService,
        private localStorageService: LocalStorageService,
        private router: Router) {
        this.userSubject = new Subject<IUserDTO | null>();
        this.user$ = this.userSubject.asObservable();
    }

    public getUser(): IUserDTO | null {
        return this._user;
    }

    set user(newUser: IUserDTO | null) {
        this._user = newUser;
        this.userSubject.next(newUser);
    }

    public async refreshAuthUserAsync() {
        try {
            this.user = await this.api.users.getByAuthAsync();
        } catch (error) {
        }
    }

    public async loginAsync(email: string, password: string): Promise<boolean> {
        try {
            const auth = await this.api.auth.loginAsync({
                email,
                password
            });

            this.localStorageService.auth.set(auth);

            this.startRefreshAsync();
            this.user = await this.api.users.getByAuthAsync();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks to see if the renew timer has been started
     */
    public hasStartedTimer(): boolean {
        return this.timeout ? true : false;
    }

    /**
     * Checks to see if the user is authenticated
     */
    public isAuthenticated(): boolean {
        const authValue = this.localStorageService.auth.get();

        if (authValue && authValue.token && authValue.expiresDateTime && authValue.expiresDateTime > new Date()) {
            return true;
        }

        return false;
    }

    /**
     * Checks to see if the authenticated user has the given role (roles found in AuthRoles)
     */
    public hasRole(role: string): boolean {
        const roles = this.getRoles();
        return roles.findIndex(x => x == role) > -1;
    }

    /**
     * Starts the renew timer
     */
    public async startRefreshAsync() {
        if (!this._user) {
            this.user = await this.api.users.getByAuthAsync();
        }
        
        if (!this.timeout) {
            this.refreshAsync();            
        }
    }

    /**
     * Logs the current user out (clears local storage, clears renew timer)
     */
    public logout(): void {
        this.localStorageService.auth.clear();

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.user = null;
    }

    private getRoles(): string[] {
        const authValue = this.localStorageService.auth.get();

        if (authValue && authValue.token && authValue.expiresDateTime && authValue.expiresDateTime > dayjs.utc().toDate()) {

            const token = JSON.parse(window.atob(authValue.token.split('.')[1]));

            if (token) {
                const result = <string[]>token.role;

                if (typeof result == 'string') return [result];

                return result;
            }
        }

        return [];
    }

    /**
     * Renews the auth token once an hour
     */
    private async refreshAsync(): Promise<void> {
        if (this.isAuthenticated()) {
            const authValue = this.localStorageService.auth.get();

            const expiresInSeconds = !authValue?.expiresDateTime ? 0 : dayjs.utc(authValue?.expiresDateTime).diff(dayjs.utc(), 'second');
            const oneHour = ((1000 * 60) * 60);

            if ((expiresInSeconds * 1000) <= oneHour) {  // If less then 1 hour left refresh now
                if (!await this.refreshTokenAsync()) {
                    this.logout();
                    this.router.navigate(['/', 'login']);
                } else {
                    this.refreshAsync();
                }
            } else {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
                this.timeout = setTimeout(async () => {
                    if (!await this.refreshTokenAsync()) {
                        this.logout();
                        this.router.navigate(['/', 'login']);
                    } else {
                        this.refreshAsync();
                    }
                }, oneHour);
            }

        }
    }

    /**
     * Refreshes the token
     */
    public async refreshTokenAsync(): Promise<boolean> {
        try {
            const auth = await this.api.auth.refreshAsync();

            if (!auth) {
                return false;
            }

            this.localStorageService.auth.set(auth);

            return true;

        } catch {
            return false;
        }
    }
}
