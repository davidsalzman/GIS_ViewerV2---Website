import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IGameDTO } from '../models/v1/game';
import { ISearchDTO } from '../models/v1/search';
import { IUserBasketDTO } from '../models/v1/user-basket';

@Injectable({
    providedIn: 'root',
})
export class ApiUserBasketService {
    private baseUrl = `${environment.baseApiUrl}/UserBasket`;

    constructor(private http: HttpClient) {
    }

    public getByAuthAsync(): Promise<IUserBasketDTO[]> {
        return firstValueFrom(this.http.get<IUserBasketDTO[]>(`${this.baseUrl}/v1`));
    }

    public addAsync(contract: {
        gameId: number,
    }): Promise<any> {
        return firstValueFrom(this.http.post(`${this.baseUrl}/v1/add`, contract));
    }

    public removeAsync(contract: {
        gameId: number,
    }): Promise<any> {
        let params = new HttpParams()
            .append('gameId', contract.gameId)

        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/remove`, { params }));
    }

    public emptyAsync(): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/empty`));
    }
}
