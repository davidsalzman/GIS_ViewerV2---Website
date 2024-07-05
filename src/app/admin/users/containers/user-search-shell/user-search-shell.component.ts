import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { ISearchDTO } from 'src/app/shared/api/models/v1/search';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';
import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';


interface IFormUser {
  searchText: FormControl<string | null>;
}

@Component({
  selector: 'app-user-search-shell',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    PaginationModule,
    RouterModule,
    TooltipModule
  ],
  templateUrl: './user-search-shell.component.html',
  styleUrls: ['./user-search-shell.component.scss']
})
export class UserSearchShellComponent implements OnInit, OnDestroy {
  faSearch = faSearch;
  faBook = faBook;
  faPlus = faPlus;
  faTimes = faTimes;

  public form = this.fb.group<IFormUser>({
    searchText: this.fb.control(null, { nonNullable: false }),
  });


  public isSubmitting = false;
  public isSearching = true;
  public itemsPerPage = 10;
  public pageNumber = 1;
  public result: ISearchDTO<IUserDTO> = {
    total: 0,
    items: []
  };

  private subscriptions: Subscription[] = [];

  private lastSearch?: {
    itemsPerPage: number,
    pageNumber: number,
    searchText: string | null
  }

  constructor(private api: ApiService,
    private breadcrumbService: BreadcrumbService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs = [{
      name: 'Users',
    }];
    this.subscriptions.push(this.route.queryParams.subscribe((params: Params) => {
      this.loadQueryParams(params);
      this.onSearch();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public onShowDelete(userId: any): void {
    const onClose = new EventEmitter<boolean>();

    this.subscriptions.push(onClose.subscribe(async (doDelete: boolean) => {
      if (doDelete && userId) {
        try {
          await this.api.users.deleteAsync(userId);
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

  public async onSearch() {
    try {
      if (isPlatformBrowser(this.platformId)) {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }

      const formDetails = this.form.getRawValue();

      const contract = {
        itemsPerPage: this.itemsPerPage,
        pageNumber: this.pageNumber,
        searchText: formDetails.searchText
      };

      if (this.lastSearch) {
        if (this.lastSearch.itemsPerPage == contract.itemsPerPage
          && this.lastSearch.pageNumber == contract.pageNumber
          && this.lastSearch.searchText == contract.searchText) {
          return;
        }
      }

      this.result = await this.api.users.searchAsync(contract);

      this.lastSearch = contract;
    } catch (error) {
      this.messageService.exception(error, 'Failed to search, please try again');
    } finally {
      this.isSearching = false;
    }
  }

  public async onToggleUser(userId: any, event: any): Promise<void> {
    if (!this.isSubmitting) {
      this.isSubmitting = true;

      try {

        await this.api.users.toggleUserUpdateAsynch(userId, {
          isActive: event.target.checked

        });
        this.updateQueryParams();
      } catch (error) {
        this.messageService.exception(error, 'Failed to update user, try again!');
      } finally {
        this.isSubmitting = false;
        this.messageService.success('User Updated');
      }
    }
  }

  public onSearchCriteriaChange() {
    this.pageNumber = 1;
    this.updateQueryParams();
  }

  public onPageChange(event: any): void {
    if (this.pageNumber !== +event.page) {
      this.pageNumber = +event.page;
      this.updateQueryParams();
    }
  }

  private loadQueryParams(params: Params) {
    this.pageNumber = params['pageNumber'] ? +params['pageNumber'] : 1;
    this.itemsPerPage = params['itemsPerPage'] ? +params['itemsPerPage'] : 10;

    this.form.patchValue({
      searchText: params['searchText'] ?? ''
    });
  }

  private updateQueryParams() {
    const formDetails = this.form.getRawValue();

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          pageNumber: this.pageNumber,
          itemsPerPage: this.itemsPerPage,
          searchText: formDetails.searchText
        },
        queryParamsHandling: 'merge'
      });
  }
}