import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { IGameDTO } from 'src/app/shared/api/models/v1/game';
import { ISearchDTO } from 'src/app/shared/api/models/v1/search';

import { ApiService } from 'src/app/shared/api/api.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { GameItemComponent } from '../../components/game-item/game-item.component';

interface IFormGroup {
  name: FormControl<string | null>;
  priceFrom: FormControl<number>;
  priceTo: FormControl<number>;
}

@Component({
  selector: 'app-game-search-shell',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    GameItemComponent,
    PaginationModule 
  ],
  templateUrl: './game-search-shell.component.html',
  styleUrls: ['./game-search-shell.component.scss']
})
export class GameSearchShellComponent implements OnInit, OnDestroy {
  faSearch = faSearch;

  public form = this.fb.group<IFormGroup>({
    name: this.fb.control(null, { nonNullable: false }),
    priceFrom: this.fb.control(0, { nonNullable: true }),
    priceTo: this.fb.control(1000, { nonNullable: true })
  });

  public isSearching = true;
  public itemsPerPage = 10;
  public pageNumber = 1;
  public result: ISearchDTO<IGameDTO> = {
    total: 0,
    items: []
  };

  private subscriptions: Subscription[] = [];

  private lastSearch?: {
    itemsPerPage: number,
    pageNumber: number,
    name: string | null,
    priceFrom: number | null;
    priceTo: number | null;
  }

  constructor(private api: ApiService,
    private breadcrumbService: BreadcrumbService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs = null;

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
        name: formDetails.name,
        priceFrom: formDetails.priceFrom,
        priceTo: formDetails.priceTo,
      };

      if (this.lastSearch) {
        if (this.lastSearch.itemsPerPage == contract.itemsPerPage
          && this.lastSearch.pageNumber == contract.pageNumber
          && this.lastSearch.name == contract.name
          && this.lastSearch.priceFrom == contract.priceFrom
          && this.lastSearch.priceTo == contract.priceTo) {
          return;
        }
      }

      this.result = await this.api.games.searchAsync(contract);

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
      name: params['name'] ?? '',
      priceFrom: params['priceFrom'] ? +params['priceFrom'] : 0,
      priceTo: params['priceTo'] ? +params['priceTo'] : 1000
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
          name: formDetails.name,
          priceFrom: formDetails.priceFrom,
          priceTo: formDetails.priceTo
        },
        queryParamsHandling: 'merge'
      });
  }
}
