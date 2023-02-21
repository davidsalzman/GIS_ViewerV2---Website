import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'confirm',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
  public title: string = 'Are you sure?';
  public text: string = 'Are you sure you wish to delete this?';
  public yesText: string = 'Yes';
  public yesColour: string = 'btn-danger';
  public noText: string = 'No';
  public noColour: string = 'btn-secondary';
  public onClose!: EventEmitter<boolean>;

  constructor(public bsModalRef: BsModalRef) { }

  public onConfirm(confirm: boolean): void {
    this.onClose.next(confirm);
    this.bsModalRef.hide();
  }
}
