import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { ISearchDTO } from '../models/v1/search';
import { IImportDTO } from '../models/v1/import';

@Injectable({
    providedIn: 'root',
})
export class ApiImportService {
    private baseUrl = `${environment.baseApiUrl}/import`;

    constructor(private http: HttpClient) {
    }

    public searchAsync(contract: {
        itemsPerPage: number,
        pageNumber: number,
        searchText: string | null
    }): Promise<ISearchDTO<IImportDTO>> {
        let params = new HttpParams()
            .append('itemsPerPage', contract.itemsPerPage)
            .append('pageNumber', contract.pageNumber);

        if (contract.searchText) params = params.append('searchText', contract.searchText);

        return firstValueFrom(this.http.get<ISearchDTO<IImportDTO>>(`${this.baseUrl}/v1/search`, { params }));
    }

    public getByIdAsync(id: number): Promise<IImportDTO> {

        return firstValueFrom(this.http.get<IImportDTO>(`${this.baseUrl}/v1/${id}`));
    }

    public getAllAsync(): Promise<IImportDTO[]> {
        
        return firstValueFrom(this.http.get<IImportDTO[]>(`${this.baseUrl}/v1/`));
    }

    public toggleImportUpdateAsynch(importId: number, contract: {
        isActive: boolean;

    }): Promise<any> {

        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/${importId}`, contract));
    }

    public createAsync(contract: {
        name: string;
        siteId: number;
        filename: string;
        zipname: string;
        description: string;
        source: string;
        destination: string;
        isActive: boolean;

    }): Promise<number> {
        console.log('Contract ' + JSON.stringify(contract));
        return firstValueFrom(this.http.post<number>(`${this.baseUrl}/v1`, contract));
    }

    public updateAsync(importId: number, contract: {
        name: string;
        siteId: number;
        filename: string;
        zipname: string;
        description: string;
        source: string;
        destination: string;
        isActive: boolean;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/admin/${importId}`, contract));
    }




    public deleteAsync(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/${id}`));
    }
}
