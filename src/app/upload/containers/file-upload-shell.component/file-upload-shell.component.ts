import { CommonModule } from '@angular/common';
import { Component,  OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUpload} from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { IExportDTO } from 'src/app/shared/api/models/v1/export';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { IImportDTO } from 'src/app/shared/api/models/v1/import';
import { HelperService } from 'src/app/shared/services/helper.service';
import { IUploadDTO } from 'src/app/shared/api/models/v1/upload';
import { HttpEventType } from '@angular/common/http';



interface IFormUpload {
    importName: FormControl<string>;
    importId: FormControl<number>;
    importControl: FormControl<number | null>;
    file: FormControl<any>;

}

@Component({
    selector: 'app-file-upload-shell',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ConfirmComponent,
        FontAwesomeModule,
        TooltipModule,
        NgxFileDropModule,
        ValidateFormControlDirective
    ],
    templateUrl: './file-upload-shell.component.html',
    styleUrls: ['./file-upload-shell.component.scss']
})
export class FileUploadShellComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    faUpload = faUpload;
    //public file: File | undefined;
    public currentFile?: File;
    public assignedImportId: number = 0;
    public message = '';
    public fileInfos?: Observable<any>;
    public files: NgxFileDropEntry[] = [];
    public filesToUpload: IUploadDTO[] = [];
    public filesUploaded: IUploadDTO[] = [];
    public imports?: IImportDTO[];
    public selectedImport?: IImportDTO;
    

   

    public uploadForm = this.fb.group<IFormUpload>({
        importName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        importId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
        file: this.fb.control('', { validators: [Validators.required] }),
        importControl: this.fb.control(1, { validators: [Validators.required] }),
        
    });


    public isSubmitting = false;
    public export?: IExportDTO;
    public progress: number = 0;


    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
        private api: ApiService,
        private helper: HelperService,
        private title: Title,
        private breadcrumbService: BreadcrumbService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private messageService: MessageService) { }

      
    async ngOnInit() {
        //this.fileInfos = this.api.uploads.getFiles();
        this.imports= await this.api.imports.getAllAsync();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    selectFile(event: any): void {
        this.currentFile = event.target.files.item(0);
    }

    // upload(): void {
    //     if (this.currentFile) {
    //         this.api.uploads.upload(this.currentFile).subscribe({
    //             next: (event: any) => {
    //                 if (event instanceof HttpResponse) {
    //                     this.message = event.body.message;
    //                     this.fileInfos = this.api.uploads.getFiles();
    //                 }
    //             },
    //             error: (err: any) => {
    //                 console.log(err);

    //                 if (err.error && err.error.message) {
    //                     this.message = err.error.message;
    //                 } else {
    //                     this.message = 'Could not upload the file!';
    //                 }
    //             },
    //             complete: () => {
    //                 this.currentFile = undefined;
    //             },
    //         });
    //     }
    // }
    public async onImportChange(value: any) { 
        await this.api.imports.getByIdAsync(value.target.value).then(
            result => this.selectedImport = result
           )
        this.assignedImportId! = this.selectedImport!.id;
        console.log(this.selectedImport?.name)
    } 

    public dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        for (const droppedFile of files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                const formData = this.uploadForm.getRawValue()
                fileEntry.file((file: File) => {
                    this.filesToUpload.push({
                        importName: this.selectedImport!.name,
                        importId: formData.importId,
                        uploadFile: file,
                        fileName: file.name,
                        fileSize: this.helper.getFileSizeforDisplay(file.size),
                        lastModified: this.helper.getFileDate(file.lastModified)

                    })
                                    
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    public fileOver(event: any) {
        console.log(event);
    }

    public fileLeave(event: any) {
        console.log(event);
    }

    public async onUploadFile(index: number) {
        var fileToUpload = this.filesToUpload.at(index);
        this.api.uploads.uploadFile(fileToUpload!).subscribe({
            next: (event: any) => {
                this.messageService.success('Import uploaded');
                

                // Add File to uploadedFiles
                this.filesUploaded.push({
                    importName: fileToUpload!.importName,
                    importId: fileToUpload!.importId,
                    uploadFile: fileToUpload!.uploadFile,
                    fileName: fileToUpload!.fileName,
                    fileSize: fileToUpload!.fileSize,
                    lastModified: fileToUpload!.lastModified

                 })
                //Remove file from files to upload list
                this.onRemoveFile(index);

              },
            error: (error: any) => {
                  console.log(error)
                this.messageService.exception(error, 'Failed to upload');
                this.isSubmitting = false;
            },
            complete: () => {
                  
              }
        })
    }

    public onRemoveFile(index: number) {
        this.filesToUpload.splice(index, 1);
    }

}