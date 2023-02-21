import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { ISearchDTO } from 'src/app/shared/api/models/v1/search';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

interface IFormGroup {
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
    RouterModule
  ],
  templateUrl: './user-search-shell.component.html',
  styleUrls: ['./user-search-shell.component.scss']
})
export class UserSearchShellComponent implements OnInit, OnDestroy {  
  faSearch = faSearch;
  faBook = faBook;
  faPlus = faPlus;

  public form = this.fb.group<IFormGroup>({
    searchText: this.fb.control(null, { nonNullable: false }),
  });

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
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.queryParams.subscribe((params: Params) => {
      this.loadQueryParams(params);
      this.onSearch();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
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
