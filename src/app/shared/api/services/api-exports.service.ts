import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { UserRoleEnum } from '../../enums/user-role';
import { ISearchDTO } from '../models/v1/search';
import { IExportDTO } from '../models/v1/export';

@Injectable({
    providedIn: 'root',
})
export class ApiExportService {
    private baseUrl = `${environment.baseApiUrl}/export`;

    constructor(private http: HttpClient) {
    }

    public searchAsync(contract: {
        itemsPerPage: number,
        pageNumber: number,
        searchText: string | null
    }): Promise<ISearchDTO<IExportDTO>> {
        let params = new HttpParams()
            .append('itemsPerPage', contract.itemsPerPage)
            .append('pageNumber', contract.pageNumber);

        if (contract.searchText) params = params.append('searchText', contract.searchText);

        return firstValueFrom(this.http.get<ISearchDTO<IExportDTO>>(`${this.baseUrl}/v1/search`, { params }));
    }

    public getAllAsync(): Promise<IExportDTO[]> {
        
        return firstValueFrom(this.http.get<IExportDTO[]>(`${this.baseUrl}/v1/`));
    }

    public getByIdAsync(id: number): Promise<IExportDTO> {

        return firstValueFrom(this.http.get<IExportDTO>(`${this.baseUrl}/v1/${id}`));
    }
    public toggleExportUpdateAsynch(exportId: number, contract: {
        isActive: boolean;

    }): Promise<any> {

        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/${exportId}`, contract));
    }

    public createAsync(contract: {
        name: string;
        siteId: number;
        filename: string;
        zipname: string;
        description: string;
        source: string;
        destination: string;
        eod: boolean;
        isActive: boolean;

    }): Promise<number> {
        console.log('Contract ' + JSON.stringify(contract));
        return firstValueFrom(this.http.post<number>(`${this.baseUrl}/v1`, contract));
    }

    public updateAsync(exportId: number, contract: {
        name: string;
        siteId: number;
        filename: string;
        zipname: string;
        description: string;
        source: string;
        destination: string;
        eod: boolean;
        isActive: boolean;
    }): Promise<any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/v1/admin/${exportId}`, contract));
    }

    public deleteAsync(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/v1/${id}`));
    }
}
