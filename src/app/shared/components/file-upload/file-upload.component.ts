import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';

import { MessageService } from '../../services/message.service';

export interface IFileUpload {
  file: File,
  name: string
}

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgxFileDropModule,
    FontAwesomeModule,
    FormsModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  faTimes = faTimes;
  
  @Input() title: string = 'Files';
  @Input() helperText?: string | null = null;  
  @Input() showTable: boolean = true;
  @Input() maxFiles: number = 10;
  @Input() allowedFileTypes: string[] = [];
  @Input() disallowedFileTypes: string[] = [];
  
  @Input() files: IFileUpload[] = [];
  @Output() filesChange = new EventEmitter<IFileUpload[]>();
  @Output() fileAdded = new EventEmitter<IFileUpload>();

  constructor(private messageService: MessageService) { }

  public dropped(files: NgxFileDropEntry[]): void {
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {

        if (this.files.length >= this.maxFiles) {
          this.messageService.warning(`A maximum of ${this.maxFiles} files are allowed to be uploaded`);
          break;
        }

        const file = files[i];
        if (file.fileEntry.isFile) {
          const fileEntry = file.fileEntry as FileSystemFileEntry;

          const fileExtension = fileEntry.name.substring(fileEntry.name.lastIndexOf('.'), fileEntry.name.length).toUpperCase();

          if (this.disallowedFileTypes.findIndex(x => x.toUpperCase() == fileExtension) > -1
            || (this.allowedFileTypes.length > 0 && this.allowedFileTypes.findIndex(x => x.toUpperCase() == fileExtension) == -1)) {
            this.messageService.warning(`File type ${fileExtension} not allowed`);
            continue;
          }

          fileEntry.file((file: File) => {
            this.files.push({ file, name: fileEntry.name.substring(0, fileEntry.name.lastIndexOf('.')) });
            this.fileAdded.next({ file, name: fileEntry.name.substring(0, fileEntry.name.lastIndexOf('.')) });
          });
        }
      }
    }
  }

  public onRemoveFile(fileIndex: number): void {
    this.files.splice(fileIndex, 1);
  }

}
