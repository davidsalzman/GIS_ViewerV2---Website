import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class MessageService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
        private toastr: ToastrService) {
    }

    /**
     * If the error has a message that is shown else the error message is shown
     * @param e Exception thrown
     * @param errorMessage Message to show if no message in exception
     */
    public exception(e: any, errorMessage: string): void {
        if (e) {
            console.error(e);
            if (isPlatformBrowser(this.platformId)) {
                if (typeof e === 'string') {
                    this.toastr.error(e, 'Exception');
                } else if (e.error && typeof e.error === 'string') {
                    this.toastr.error(e.error, 'Exception');
                } else {
                    this.toastr.error(errorMessage, 'Exception');
                }
            }
        }
    }

    public danger(message: string, title?: string | undefined, overrideConfig?: Partial<IndividualConfig>) {
        if (isPlatformBrowser(this.platformId)) {
            this.toastr.error(message, title, overrideConfig);
        }
    }

    public success(message: string, title?: string | undefined, overrideConfig?: Partial<IndividualConfig>) {
        if (isPlatformBrowser(this.platformId)) {
            this.toastr.success(message, title, overrideConfig);
        }
    }

    public info(message: string, title?: string | undefined, overrideConfig?: Partial<IndividualConfig>) {
        if (isPlatformBrowser(this.platformId)) {
            this.toastr.info(message, title, overrideConfig);
        }
    }

    public warning(message: string, title?: string | undefined, overrideConfig?: Partial<IndividualConfig>) {
        if (isPlatformBrowser(this.platformId)) {
            this.toastr.warning(message, title, overrideConfig);
        }
    }
}
