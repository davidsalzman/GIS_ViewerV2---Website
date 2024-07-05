import { Injectable } from '@angular/core';

import { ApiAuthService } from './services/api-auth.service';
import { ApiUsersService } from './services/api-users.service';
import { ApiExportService } from './services/api-exports.service';
import { ApiImportService } from './services/api-import.service';
import { ApiUploadService } from './services/api-upload.service';
import { ApiDownloadService } from './services/api-download.service';
import { ApiAllPayService } from './services/api-allpay.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(public auth: ApiAuthService,
        public users: ApiUsersService,
        public exports: ApiExportService,
        public downloads: ApiDownloadService,
        public imports: ApiImportService,
        public uploads: ApiUploadService,
        public allPay: ApiAllPayService) {
    }
}
