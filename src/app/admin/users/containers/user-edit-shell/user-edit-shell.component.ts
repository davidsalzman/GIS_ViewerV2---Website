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
import { IUserDTO } from 'src/app/shared/api/models/v1/user';

import { UserRoleEnum } from 'src/app/shared/enums/user-role';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';

import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

interface IFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
  ad: FormControl<string | null>;
  groupId: FormControl<number>;
  role: FormControl<number>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: 'app-user-edit-shell',
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
  templateUrl: './user-edit-shell.component.html',
  styleUrls: ['./user-edit-shell.component.scss']
})
export class UserEditShellComponent implements OnInit, OnDestroy {
  faTimes = faTimes;

  public form = this.fb.group<IFormGroup>({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control('', { nonNullable: true,validators: [Validators.required, Validators.email] }),
    ad: this.fb.control(null),
    groupId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
    role: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
    isActive: this.fb.control(false,{nonNullable: true,validators: [Validators.required]})
  });

  
  public UserRoleEnum = UserRoleEnum;

  public isSubmitting = false;
  public user?: IUserDTO;
 

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
    const userId = +this.route.snapshot.params['id'];
    

    if(userId > 0){
      try {
        
        this.user = await this.api.users.getByIdAsync(userId);
        this.form.patchValue({
          name: this.user.name,
          email: this.user.email,
          ad: this.user.ad,
          role: this.user.role,
          isActive: this.user.isActive
        });
        this.title.setTitle(`${this.user.name} | Pay360 Local`);
     
      this.breadcrumbService.breadcrumbs = [{
        name: 'Users',
        url: ['/', 'user']
      },{
        name: this.user.name,
      }];

      } catch (error) {
        this.messageService.exception(error, 'Failed to load user');
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public onShowDelete(): void {
    const onClose = new EventEmitter<boolean>();

    this.subscriptions.push(onClose.subscribe(async (doDelete: boolean) => {
      if (doDelete && this.user) {
        try {
          await this.api.users.deleteAsync(this.user.id);
          this.messageService.success('User Deleted');
          this.router.navigate(['/', 'user']);
        } catch (error) {
          this.messageService.exception(error, 'Failed to delete user');
        }
      }
    }));

    const initialState: ModalOptions = {
      initialState: {
        onClose: onClose,
        title: 'Are you sure?',
        text: `Are you sure you wish to delete this user?`
      }
    };
    const bsModalRef = this.modalService.show(ConfirmComponent, initialState);
  }

  public async onCancel(message: string) {
    this.messageService.success(message);
        this.router.navigate(['/', 'user']);
  }

  public async onSubmit() {
    this.user ? this.onUpdate() : this.onCreate();
  }

  private async onCreate() {
    if (this.form.valid && !this.isSubmitting) {
      try {
        this.spinner.show();
        this.isSubmitting = true;
        const formDetails = this.form.getRawValue();
        console.log(JSON.stringify(formDetails));
        const userId = await this.api.users.createAsync({
          name: formDetails.name,
          ad: formDetails.ad,
          email: formDetails.email,
          isActive: formDetails.isActive,
          role: +formDetails.role
        });
        // Assign the user to the chosen group
       
        this.messageService.success('User Created');
        this.router.navigate(['/', 'user'])
      } catch (error) {
        this.messageService.exception(error, 'Failed to create user');
      } finally {
        this.isSubmitting = false;
        this.spinner.hide();
      }
    }
  }

  private async onUpdate() {
    if (this.user && this.form.valid && !this.isSubmitting) {
      try {
        
        this.spinner.show();
        this.isSubmitting = true;
        const formDetails = this.form.getRawValue();
        
        const userId = await this.api.users.adminUpdateAsync(this.user.id, {
          name: formDetails.name,
          ad: formDetails.ad!, 
          email: formDetails.email,
          isActive: formDetails.isActive,
          role: +formDetails.role!
          
        });

        this.messageService.success('User updated');
        this.router.navigate(['/', 'user']);
      } catch (error) {
        this.messageService.exception(error, 'Failed to update user');
      } finally {
        this.isSubmitting = false;
        this.spinner.hide();
      }
    }
  }
}