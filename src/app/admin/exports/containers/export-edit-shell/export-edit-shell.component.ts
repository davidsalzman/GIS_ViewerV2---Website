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

interface IFormGroup {
    siteId: FormControl<number>;
    name:  FormControl<string>;
    filename: FormControl<string>;
    zipname: FormControl<string>;
    description: FormControl<string>;
    source: FormControl<string>;
    destination: FormControl<string>;
    eod: FormControl<boolean>;
    isActive: FormControl<boolean>;
}

@Component({
    selector: 'app-export-edit-shell',
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
    templateUrl: './export-edit-shell.component.html',
    styleUrls: ['./export-edit-shell.component.scss']
})
export class ExportEditShellComponent implements OnInit, OnDestroy {
    faTimes = faTimes;

    public form = this.fb.group<IFormGroup>({
        siteId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
        name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        filename: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        zipname: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        description: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        source: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        destination: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        eod: this.fb.control(false, { nonNullable: true, validators: [Validators.required] }),
        isActive: this.fb.control(false, { nonNullable: true, validators: [Validators.required] })
    });

    
    public isSubmitting = false;
    public export?: IExportDTO;


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
        const exportId = +this.route.snapshot.params['id'];


        if (exportId > 0) {
            try {

                this.export = await this.api.exports.getByIdAsync(exportId);
                this.form.patchValue({
                   
                    siteId: this.export.siteId,
                    name: this.export.name,
                    filename: this.export.filename,
                    zipname: this.export.zipname,
                    description: this.export.description,
                    source: this.export.source,
                    destination: this.export.destination,
                    eod: this.export.eod,
                    isActive: this.export.isActive
                    
                });
                this.title.setTitle(`${this.export.description} | Pay360 Local`);
console.log('Zipname = ' + this.export.zipname)
                this.breadcrumbService.breadcrumbs = [{
                    name: 'Exports',
                    url: ['/', 'export']
                }, {
                    name: this.export.description,
                }];

            } catch (error) {
                this.messageService.exception(error, 'Failed to load export');
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    public onShowDelete(): void {
        const onClose = new EventEmitter<boolean>();

        this.subscriptions.push(onClose.subscribe(async (doDelete: boolean) => {
            if (doDelete && this.export) {
                try {
                    await this.api.users.deleteAsync(this.export.id);
                    this.messageService.success('Export Deleted');
                    this.router.navigate(['/', 'export']);
                } catch (error) {
                    this.messageService.exception(error, 'Failed to delete export');
                }
            }
        }));

        const initialState: ModalOptions = {
            initialState: {
                onClose: onClose,
                title: 'Are you sure?',
                text: `Are you sure you wish to delete this export?`
            }
        };
        const bsModalRef = this.modalService.show(ConfirmComponent, initialState);
    }

    public async onCancel(message: string) {
        this.messageService.success(message);
        this.router.navigate(['/', 'export']);
    }

    public async onSubmit() {
        this.export ? this.onUpdate() : this.onCreate();
    }

    private async onCreate() {
        if (this.form.valid && !this.isSubmitting) {
            try {
                this.spinner.show();
                this.isSubmitting = true;
                const formDetails = this.form.getRawValue();
                
                const exportId = await this.api.exports.createAsync({
                    siteId: formDetails.siteId,
                    name: formDetails.name,
                    filename: formDetails.filename,
                    zipname: formDetails.zipname,
                    description: formDetails.description,
                    source: formDetails.source,
                    destination: formDetails.destination,
                    eod: formDetails.eod,
                    isActive: formDetails.isActive
                   
                });
                // Assign the user to the chosen group

                this.messageService.success('Export Created');
                this.router.navigate(['/', 'export'])
            } catch (error) {
                this.messageService.exception(error, 'Failed to create Export');
            } finally {
                this.isSubmitting = false;
                this.spinner.hide();
            }
        }
    }

    private async onUpdate() {
        if (this.export && this.form.valid && !this.isSubmitting) {
            try {

                this.spinner.show();
                this.isSubmitting = true;
                const formDetails = this.form.getRawValue();

                const exportId = await this.api.exports.updateAsync(this.export.id, {
                    name: formDetails.name,
                    siteId: formDetails.siteId,
                    filename: formDetails.filename,
                    zipname: formDetails.zipname,
                    description: formDetails.description,
                    source: formDetails.source,
                    destination: formDetails.destination,
                    eod: formDetails.eod,
                    isActive: formDetails.isActive
                });

                this.messageService.success('Export updated');
                this.router.navigate(['/', 'export']);
            } catch (error) {
                this.messageService.exception(error, 'Failed to update Export');
            } finally {
                this.isSubmitting = false;
                this.spinner.hide();
            }
        }
    }
}