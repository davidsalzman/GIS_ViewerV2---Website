import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../services/local-storage.service';

dayjs.extend(utc);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.withCredentials === true) {
      return next.handle(req);
    }

    const authDetails = this.localStorageService.auth.get();

    if (authDetails && authDetails.expiresDateTime && authDetails.expiresDateTime > dayjs.utc().toDate()) {
      const copiedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + authDetails.token) });
      return next.handle(copiedReq);
    } else {
      return next.handle(req);
    }
  }
}
