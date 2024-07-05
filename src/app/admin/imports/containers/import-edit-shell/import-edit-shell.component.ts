import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { IExportDTO } from 'src/app/shared/api/models/v1/export';
import { IImportDTO } from 'src/app/shared/api/models/v1/import';

interface IFormGroup {
    siteId: FormControl<number>;
    name:  FormControl<string>;
    filename: FormControl<string>;
    zipname: FormControl<string>;
    description: FormControl<string>;
    source: FormControl<string>;
    destination: FormControl<string>;
    isActive: FormControl<boolean>;
}

@Component({
    selector: 'app-import-edit-shell',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ConfirmComponent,
        FontAwesomeModule,
        TooltipModule,
        ValidateFormControlDirective
    ],
    templateUrl: './import-edit-shell.component.html',
    styleUrls: ['./import-edit-shell.component.scss']
})
export class ImportEditShellComponent implements OnInit, OnDestroy {
    faTimes = faTimes;

    public form = this.fb.group<IFormGroup>({
        siteId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
        name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        filename: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        zipname: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        description: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        source: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        destination: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        isActive: this.fb.control(false, { nonNullable: true, validators: [Validators.required] })
    });

    
    public isSubmitting = false;
    public import?: IImportDTO;


    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
        private api: ApiService,
        private title: Title,
        private breadcrumbService: BreadcrumbService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private messageService: MessageService) { }

    async ngOnInit() {
        const importId = +this.route.snapshot.params['id'];


        if (importId > 0) {
            try {

                this.import = await this.api.imports.getByIdAsync(importId);
                this.form.patchValue({
                   
                    siteId: this.import.siteId,
                    name: this.import.name,
                    filename: this.import.filename,
                    zipname: this.import.zipname,
                    description: this.import.description,
                    source: this.import.source,
                    destination: this.import.destination,
                    isActive: this.import.isActive
                    
                });
                this.title.setTitle(`${this.import.description} | Pay360 Local`);
                this.breadcrumbService.breadcrumbs = [{
                    name: 'Imports',
                    url: ['/', 'import']
                }, {
                    name: this.import.description,
                }];

            } catch (error) {
                this.messageService.exception(error, 'Failed to load import');
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    public onShowDelete(): void {
        const onClose = new EventEmitter<boolean>();

        this.subscriptions.push(onClose.subscribe(async (doDelete: boolean) => {
            if (doDelete && this.import) {
                try {
                    await this.api.users.deleteAsync(this.import.id);
                    this.messageService.success('Import Deleted');
                    this.router.navigate(['/', 'import']);
                } catch (error) {
                    this.messageService.exception(error, 'Failed to delete import');
                }
            }
        }));

        const initialState: ModalOptions = {
            initialState: {
                onClose: onClose,
                title: 'Are you sure?',
                text: `Are you sure you wish to delete this import?`
            }
        };
        const bsModalRef = this.modalService.show(ConfirmComponent, initialState);
    }

    public async onCancel(message: string) {
        this.messageService.success(message);
        this.router.navigate(['/', 'import']);
    }

    public async onSubmit() {
        this.import ? this.onUpdate() : this.onCreate();
    }

    private async onCreate() {
        if (this.form.valid && !this.isSubmitting) {
            try {
                this.spinner.show();
                this.isSubmitting = true;
                const formDetails = this.form.getRawValue();
                
                const importId = await this.api.imports.createAsync({
                    siteId: formDetails.siteId,
                    name: formDetails.name,
                    filename: formDetails.filename,
                    zipname: formDetails.zipname,
                    description: formDetails.description,
                    source: formDetails.source,
                    destination: formDetails.destination,
                    isActive: formDetails.isActive
                   
                });
                // Assign the user to the chosen group

                this.messageService.success('Import Created');
                this.router.navigate(['/', 'import'])
            } catch (error) {
                this.messageService.exception(error, 'Failed to create Import');
            } finally {
                this.isSubmitting = false;
                this.spinner.hide();
            }
        }
    }

    private async onUpdate() {
        if (this.import && this.form.valid && !this.isSubmitting) {
            try {

                this.spinner.show();
                this.isSubmitting = true;
                const formDetails = this.form.getRawValue();

                const importId = await this.api.imports.updateAsync(this.import.id, {
                    name: formDetails.name,
                    siteId: formDetails.siteId,
                    filename: formDetails.filename,
                    zipname: formDetails.zipname,
                    description: formDetails.description,
                    source: formDetails.source,
                    destination: formDetails.destination,
                    isActive: formDetails.isActive
                });

                this.messageService.success('Import updated');
                this.router.navigate(['/', 'import']);
            } catch (error) {
                this.messageService.exception(error, 'Failed to update import');
            } finally {
                this.isSubmitting = false;
                this.spinner.hide();
            }
        }
    }
}