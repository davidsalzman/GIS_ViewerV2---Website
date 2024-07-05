import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from './local-storage.service';
import { IUserDTO } from '../api/models/v1/user';
import { IAuthDTO } from '../api/models/v1/auth';
import moment from 'moment';


@Injectable({
    providedIn: 'root',
})
export class AuthService {

    public authChanged = new EventEmitter<IUserDTO | null>();

    private timeout: any;
    private authUser: IUserDTO | null = null;

    constructor(private api: ApiService,
        private localStorageService: LocalStorageService,
        private router: Router) {

    }

    /**
     * Get the token of the currently authenticated user
     */
    public getToken(): string {
        console.log('getToken Method called')
        const authDetails = this.localStorageService.auth.get();

        return authDetails!.token;
    }

    public async getAuthUser(refresh = false): Promise<IUserDTO | null> {
        console.log('getAuthUser method called')
        if (refresh || (this.authUser == null && this.isAuthenticated())) {
            try {
                this.authUser = await this.api.users.getAuth();
            } catch (error) {
                this.authUser = null;
            }
        }
        console.log(' getAuthUser method - auth user = ' + JSON.stringify(this.authUser))
        return this.authUser;
    }

    /**
     * Sets the auth details in local storage
     * @param auth Authentication details
     */
    public async login(auth: IAuthDTO) {
        console.log('login method called auth expireddateTime = ' + auth.expiresDateTime)
        this.localStorageService.auth.set({
            token: auth.token,
            expiresDateTime: auth.expiresDateTime
           
        });

        this.authUser = null;
        const user = await this.getAuthUser()
        this.authChanged.emit(user);
    }

    /**
     * Logs the current user out (clears local storage, clears renew timer)
     */
    public async logout() {
        this.localStorageService.auth.clear();
        this.authUser = null;
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.authChanged.emit(null);
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
console.log('isAuthenticated  authValue = ' + JSON.stringify(authValue))
        if (authValue && authValue.token && authValue.expiresDateTime > moment.utc().toDate()) {
            return true;
        }

        return false;
    }

   

    /**
     * Starts the renew timer
     */
    public startRefresh(): void {
        console.log('timeout = ' + this.timeout)
        if (!this.timeout) {
            console.log('timeout - refresh called')
            this.refresh();
        }
    }

    /**
     * Renews the auth token
     */
    private async refresh(): Promise<void> {
        if (this.isAuthenticated()) {
            console.log('refresh method and is Authenticated')
            const authValue = this.localStorageService.auth.get();

            const expiresIn = moment.utc(authValue?.expiresDateTime).diff(moment.utc().add(30, 'seconds'), 'seconds');
            if (expiresIn <= 30000) {
                if (!await this.refreshToken()) {
                    this.logout();
                    this.router.navigate(['/', 'login']);
                } else {
                    this.refresh();
                }
            } else {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
                this.timeout = setTimeout(async () => {
                    if (!await this.refreshToken()) {
                        this.logout();
                        this.router.navigate(['/', 'login']);
                    } else {
                        this.refresh();
                    }
                }, 1000 * 60 * 60); // Refresh once an hour
            }
        }
    }

    /**
     * Refreshes the token
     */
    public async refreshToken(notifyChange = true): Promise<boolean> {
        try {
            const auth = await this.api.auth.refreshToken();

            if (!auth) {
                return false;
            }

            this.localStorageService.auth.set({
                token: auth.token,
                expiresDateTime: auth.expiresDateTime
                
            });

            if (notifyChange) {
                try {
                    await this.getAuthUser(true);
                } catch (error) {

                }

                this.authChanged.next(this.authUser);
            }

            return true;

        } catch {
            return false;
        }
    }
}