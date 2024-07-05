import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';


dayjs.extend(utc);

@Injectable({
    providedIn: 'root',
})
export class HelperService {

    public getFileDate(fileDate: number): string {
        return new Date(fileDate).toLocaleString()
    }

    public getFileSizeforDisplay(fileSize: number): string {
        var result;
        const fileSizeFormat = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
           });
         
           if (fileSize > 1000) {
             result = `${fileSizeFormat.format(fileSize / 1000)} MB`;
           } else {
             result = `${fileSizeFormat.format(fileSize)} KB`;
        }
        return result;


   }
}
