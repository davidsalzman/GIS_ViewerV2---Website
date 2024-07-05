import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { IAllPayFileDTO } from 'src/app/shared/api/models/v1/allpayFile';
import { IAllPayFileExtractDTO } from 'src/app/shared/api/models/v1/allpayFileExtract';
import { IAllPayRecordExtractDTO } from 'src/app/shared/api/models/v1/allpayRecordExtract';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'allPayRecortds',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './allPayRecords.component.html',
  styleUrls: ['./allPayRecords.component.scss']
})
export class AllPayRecordsComponent {
  public title: string = 'Are you sure?';
    public text: string = 'Are you sure you wish to delete this?';
    public allPayFile?: IAllPayFileExtractDTO;
    
  
  

  constructor(public bsModalRef: BsModalRef) {
   
  }

  
}