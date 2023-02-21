import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IOrderDTO } from '../models/v1/order';
import { ISearchDTO } from '../models/v1/search';

@Injectable({
    providedIn: 'root',
})
export class ApiOrdersService {
    private baseUrl = `${environment.baseApiUrl}/orders`;

    constructor(private http: HttpClient) {
    }

    public createAsync(contract: {
        name: string,
        email: string,
        totalCharge: number,
        games: {
            gameId: number,
            quantity: number
        }[]
    }): Promise<number> {
        return firstValueFrom(this.http.post<number>(`${this.baseUrl}/v1`, contract));
    }

    public getByIdAsync(id: number): Promise<IOrderDTO> {
        return firstValueFrom(this.http.get<IOrderDTO>(`${this.baseUrl}/v1/${id}`));
    }

    public getByTokenAsync(id: number, token: string): Promise<IOrderDTO> {
        let params = new HttpParams().append('token', token);

        return firstValueFrom(this.http.get<IOrderDTO>(`${this.baseUrl}/v1/${id}`, { params }));
    }

    public searchAsync(contract: {
        itemsPerPage: number,
        pageNumber: number
    }): Promise<ISearchDTO<IOrderDTO>> {
        let params = new HttpParams()
            .append('itemsPerPage', contract.itemsPerPage)
            .append('pageNumber', contract.pageNumber);

        return firstValueFrom(this.http.get<ISearchDTO<IOrderDTO>>(`${this.baseUrl}/v1/auth`, { params }));
    }
}
