import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IGameDTO } from '../models/v1/game';
import { ISearchDTO } from '../models/v1/search';

@Injectable({
    providedIn: 'root',
})
export class ApiGamesService {
    private baseUrl = `${environment.baseApiUrl}/games`;

    constructor(private http: HttpClient) {
    }

    public getByIdAsync(id: number): Promise<IGameDTO> {
        return firstValueFrom(this.http.get<IGameDTO>(`${this.baseUrl}/v1/${id}`));
    }

    public searchAsync(contract: {
        itemsPerPage: number,
        pageNumber: number,
        name: string | null,
        priceFrom: number | null,
        priceTo: number | null
    }): Promise<ISearchDTO<IGameDTO>> {
        let params = new HttpParams()
            .append('itemsPerPage', contract.itemsPerPage)
            .append('pageNumber', contract.pageNumber);

            if(contract.name) params = params.append('name', contract.name);
            if(contract.priceFrom) params = params.append('priceFrom', contract.priceFrom);
            if(contract.priceTo) params = params.append('priceTo', contract.priceTo);

        return firstValueFrom(this.http.get<ISearchDTO<IGameDTO>>(`${this.baseUrl}/v1/search`, { params }));
    }
}
