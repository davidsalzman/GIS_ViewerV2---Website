import { CommonModule, getLocaleDayNames } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUpload, faSearch, faCircleArrowUp, faCircleArrowDown, faAngleDoubleDown, faAngleDoubleUp, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';
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
import { IAllPayFileDTO } from 'src/app/shared/api/models/v1/allpayFile';
import { IAllPayFileExtractDTO } from 'src/app/shared/api/models/v1/allpayFileExtract';
import { IAllPayRecordExtractDTO } from 'src/app/shared/api/models/v1/allpayRecordExtract';
import { AllPayRecordsComponent } from 'src/app/shared/components/allPayRecords/allPayRecords.component';



interface IFormAllpay {
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
    templateUrl: './allpay-shell.component.html',
    styleUrls: ['./allpay-shell.component.scss']
})
export class AllpayShellComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    faUpload = faUpload;
    faSearch = faSearch;
    faCircleArrowUp = faCircleArrowUp;
    faCircleArrowDown = faCircleArrowDown;
    faAngleDoubleDown = faAngleDoubleDown;
    faAngleDoubleUp = faAngleDoubleUp;
    faCogs = faCogs;
    //public file: File | undefined;
    public currentFile?: File;
    public assignedImportId: number = 0;
    public message = '';
    public fileInfos?: Observable<any>;
    public files: NgxFileDropEntry[] = [];
    public filesToProcess: IAllPayFileDTO[] = [];
    public filesUploaded: IUploadDTO[] = [];
    public imports?: IImportDTO[];
    public selectedImport?: IImportDTO;
    public extractedFile?: IAllPayFileExtractDTO;
    public extractedFiles: IAllPayFileExtractDTO[] = [];
    public duplicatedFiles: IAllPayFileExtractDTO[] = [];
    public allPayRecords: IAllPayRecordExtractDTO[] = [];




    public allpayForm = this.fb.group<IFormAllpay>({
        importName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        importId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
        file: this.fb.control('', { validators: [Validators.required] }),
        importControl: this.fb.control(1, { validators: [Validators.required] }),

    });

    public processed: boolean = false;
    public allPayFeeder: string = '';
    public isSubmitting = false;
    public export?: IExportDTO;
    public progress: number = 0;
    public fileTotal: number = 0;


    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
        private api: ApiService,
        private filesaverService: FileSaverService,
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
        this.imports = await this.api.imports.getAllAsync();
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
    // public async onImportChange(value: any) {
    //     await this.api.imports.getByIdAsync(value.target.value).then(
    //         result => this.selectedImport = result
    //     )
    //     this.assignedImportId! = this.selectedImport!.id;
    //     console.log(this.selectedImport?.name)
    // }

    public dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        this.processed = false;
        for (const droppedFile of files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                const formData = this.allpayForm.getRawValue();
                fileEntry.file(async (file: File) => {
                    await this.api.allPay.extractFile(file, file.name).then(
                        result => this.extractedFile = result

                    );
                    console.log('Extracted file = ' + JSON.stringify(this.extractedFile))
                    if (this.extractedFile?.duplicatedFiles && this.extractedFile?.duplicatedFiles.length == 0) {
                        this.extractedFiles.push({
                            allPayId: this.extractedFile?.allPayId!,
                            createdDateUTC: this.extractedFile?.createdDateUTC!,
                            name: this.extractedFile?.name!,
                            totalAmount: this.extractedFile?.totalAmount!,
                            totalRecords: this.extractedFile?.totalRecords!,
                            type: this.extractedFile?.type!,
                            typeDTO: this.extractedFile.typeDTO,
                            allPayRecords: this.extractedFile?.allPayRecords!,
                            duplicatedFiles: this.extractedFile?.duplicatedFiles!,
                            processedDateUTC: this.extractedFile?.processedDateUTC,
                            expanded: false

                        })
                        this.fileTotal += this.extractedFile?.totalAmount!;
                    }
                    if (this.extractedFile?.duplicatedFiles && this.extractedFile?.duplicatedFiles.length > 0) {
                        this.duplicatedFiles.push({
                            allPayId: this.extractedFile?.allPayId!,
                            createdDateUTC: this.extractedFile?.createdDateUTC!,
                            name: this.extractedFile?.name!,
                            totalAmount: this.extractedFile?.totalAmount!,
                            totalRecords: this.extractedFile?.totalRecords!,
                            type: this.extractedFile?.type!,
                            typeDTO: this.extractedFile.typeDTO,
                            allPayRecords: this.extractedFile?.allPayRecords!,
                            duplicatedFiles: this.extractedFile?.duplicatedFiles!,
                            processedDateUTC: this.extractedFile?.processedDateUTC,
                            expanded: false

                        })

                    }

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

    public async onShowDuplicate(index: number) {

        var allPayFile = this.duplicatedFiles.at(index);
        console.log('selected file = ' + JSON.stringify(allPayFile))
        var duplicatedFile;

        await this.api.allPay.getByIdAsync(allPayFile?.duplicatedFiles.at(0)!).then(
            result => duplicatedFile = result
        )

        console.log('duplicared file = ' + JSON.stringify(duplicatedFile))
        console.log('records = ' + allPayFile!.allPayRecords.length)
        const initialState: ModalOptions = {
            initialState: {
                allPayFile: duplicatedFile


            }
        };

        const bsModalRef = this.modalService.show(AllPayRecordsComponent, initialState);
    }

    public onRemoveFile(index: number) {
        var extractedFile = this.extractedFiles.at(index);
        this.fileTotal = this.fileTotal - extractedFile?.totalAmount!;
        this.extractedFiles.splice(index, 1);
        // If all files have been removed then also remove any duplicated files
        //if (this.extractedFiles.length === 0) {
        // this.duplicatedFiles = [];
        //}
    }

    public async onCreateFile() {
        try {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            this.allPayFeeder = 'ALP' + day + '-' + month + '-' + year + '.txt';

            await this.api.allPay.createFile({
                extractedFiles: this.extractedFiles
            }).then(res => {
                
                if (res) {
                    this.filesaverService.save(res, this.allPayFeeder)
                    this.processed = true;
                    this.messageService.success('Feeder file has been created')
                }
                else {
                    this.processed = false;
                    this.messageService.exception('error', 'Failed to create feeder file');

                }
            });

        }
        catch (error) {
            this.processed = false;
            this.messageService.exception(error, 'Failed to create feeder file');
        }
    }

}