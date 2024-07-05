import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
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

        if (contract.searchText) params = params.append('searchText', contract.searchText);

        return firstValueFrom(this.http.get<ISearchDTO<IUserDTO>>(`${this.baseUrl}/v1/search`, { params }));
    }


    /**
    * Gets a user by their Id
    * @param userId user to get
    */
    public getByIdAsync(id: number): Promise<IUserDTO> {

        return firstValueFrom(this.http.get<IUserDTO>(`${this.baseUrl}/v1/${id}`));
    }
    /**
    * Gets the auth user details
    */
    public getAuth(): Promise<IUserDTO> {
        console.log('url = ' + `${this.baseUrl}/v1/auth`)
        return firstValueFrom(this.http.get<IUserDTO>(`${this.baseUrl}/v1/auth`));
    }

    /**
     * Creates the given user
     * @param name Name of the user member
     * @param ad AD name
     * @param email Email
     * @param role Role the staff has
     *
     */
    public createAsync(contract: {
        email: string;
        name: string;
        ad: string | null;
        isActive: boolean;
        role: UserRoleEnum;

    }): Promise<number> {
        console.log('Contract ' + JSON.stringify(contract));
        return firstValueFrom(this.http.post<number>(`${this.baseUrl}/v1`, contract));
    }

    /**
    * Updates the given user
    */
    public adminUpdateAsync(userId: number, contract: {
        email: string;
        name: string;
        ad: string;
        isActive: boolean;
        role: UserRoleEnum;

    }): Promise<any> {
        console.log(JSON.stringify(contract))

        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/admin/${userId}`, contract));
    }

    public toggleUserUpdateAsynch(userId: number, contract: {
        isActive: boolean;

    }): Promise<any> {

        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/${userId}`, contract));
    }

    public deleteAsync(userId: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/${userId}`));
    }
}
