import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IUploadDTO } from '../models/v1/upload';
import { Observable, firstValueFrom } from 'rxjs';
import { throwError } from "rxjs";
import { IAllPayFileExtractDTO } from '../models/v1/allpayFileExtract';
import { IAllPayFileDTO } from '../models/v1/allpayFile';

@Injectable({
  providedIn: 'root',
})
export class ApiAllPayService {
  private baseUrl = `${environment.baseApiUrl}/allpay`;

  constructor(private http: HttpClient) {
  }

  public getByIdAsync(id: number): Promise<IAllPayFileDTO> {

    return firstValueFrom(this.http.get<IAllPayFileDTO>(`${this.baseUrl}/v1/${id}`));
  }

  public extractFile(file: File, filename: string): Promise<IAllPayFileExtractDTO> {

    const formData: FormData = new FormData();
    formData.append('allpayFile', file, filename);
    return firstValueFrom(this.http.post<IAllPayFileExtractDTO>(`${this.baseUrl}/V1/ReadFile`, formData, { reportProgress: true, responseType: 'json' }));
  }

  // public createFile(extractedFiles: IAllPayFileExtractDTO[]): Promise<number[]>{
  //   console.log("api called")
  //   return firstValueFrom(this.http.post<number[]>(`${this.baseUrl}/v1/CreateFile`, extractedFiles));
  // }

  public createFile(contract: {
    extractedFiles: IAllPayFileExtractDTO[];

  }): Promise<Blob> {
    console.log('Contract ' + JSON.stringify(contract));
    return firstValueFrom(this.http.post(`${this.baseUrl}/v1/CreateFile`, contract,  { responseType: 'blob' }));
  }

}
