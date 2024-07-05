
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IUploadDTO } from '../models/v1/upload';
import { Observable, firstValueFrom } from 'rxjs';
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ApiUploadService {
  private baseUrl = `${environment.baseApiUrl}/upload`;

  constructor(private http: HttpClient) {
  }

  public uploadFile(upload: IUploadDTO): Observable<HttpEvent<any>> {
    
    const formData: FormData = new FormData();
      
    formData.append('importFile', upload.uploadFile, upload.fileName);
    formData.append('importId', upload.importId.toString());
     
    return this.http.post<any>(`${this.baseUrl}/V1`, formData, {reportProgress: true,responseType: 'json'});
}

 
}



