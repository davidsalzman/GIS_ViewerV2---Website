import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserPermissionEnum } from '../../enums/user-permission';
import { UserRoleEnum } from '../../enums/user-role';
import { ISearchDTO } from '../models/v1/search';
import { IUserDTO } from '../models/v1/user';

@Injectable({
    providedIn: 'root',
})
export class ApiUsersService {
    private baseUrl = `${environment.baseApiUrl}/users`;

    constructor(private http: HttpClient) {
    }
   
    public searchAsync(contract: {
        itemsPerPage: number,
        pageNumber: number,
        searchText: string | null
    }): Promise<ISearchDTO<IUserDTO>> {
        let params = new HttpParams()
            .append('itemsPerPage', contract.itemsPerPage)
            .append('pageNumber', contract.pageNumber);

            if(contract.searchText) params = params.append('searchText', contract.searchText);

        return firstValueFrom(this.http.get<ISearchDTO<IUserDTO>>(`${this.baseUrl}/v1/search`, { params }));
    }

    public getByIdAsync(id: number): Promise<IUserDTO> {
        return firstValueFrom(this.http.get<IUserDTO>(`${this.baseUrl}/v1/${id}`));
    }

    public getByAuthAsync(): Promise<IUserDTO> {
        return firstValueFrom(this.http.get<IUserDTO>(`${this.baseUrl}/v1/auth`));
    }

    public changePasswordAsync(contract: {
        currentPassword: string;
        newPassword: string;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/change-password`, contract));
    }

    public confirmAccountAsync(contract: {
        email: string;
        token: string;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/confirm-account`, contract));
    }

    public signUpAsync(contract: {
        email: string;
        name: string;
        password: string;
        redirect?: string | null
    }): Promise<any> {
        return firstValueFrom(this.http.post(`${this.baseUrl}/v1/sign-up`, contract));
    }

    public createAsync(contract: {
        email: string;
        name: string;
        ad: string | null;
        roles: {
            role: UserRoleEnum;
            permission: UserPermissionEnum;
        }[]
    }): Promise<number> {
        return firstValueFrom(this.http.post<number>(`${this.baseUrl}/v1`, contract));
    }

    public updateAsync(contract: {
        name: string;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1`, contract));
    }

    public adminUpdateAsync(userId: number, contract: {
        email: string;
        name: string;
        ad: string | null;
        roles: {
            role: UserRoleEnum;
            permission: UserPermissionEnum;
        }[]
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/admin/${userId}`, contract));
    }

    public requestResetPasswordAsync(contract: {
        email: string;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/request-reset-password`, contract));
    }

    public resetPasswordAsync(contract: {
        email: string;
        token: string;
        password: string;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/reset-password`, contract));
    }

    public deleteAsync(userId: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/${userId}`));
    }
}
