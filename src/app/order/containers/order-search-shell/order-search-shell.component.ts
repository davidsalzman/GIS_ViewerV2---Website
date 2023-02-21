import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { IOrderDTO } from 'src/app/shared/api/models/v1/order';
import { ISearchDTO } from 'src/app/shared/api/models/v1/search';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { OrderItemComponent } from '../../components/order-item/order-item.component';

@Component({
  selector: 'app-order-search-shell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    OrderItemComponent
  ],
  templateUrl: './order-search-shell.component.html',
  styleUrls: ['./order-search-shell.component.scss']
})
export class OrderSearchShellComponent implements OnInit, OnDestroy {
  public isSearching = true;
  public itemsPerPage = 10;
  public pageNumber = 1;
  public result: ISearchDTO<IOrderDTO> = {
    total: 0,
    items: []
  };

  private subscriptions: Subscription[] = [];

  private lastSearch?: {
    itemsPerPage: number,
    pageNumber: number,
  }

  constructor(private api: ApiService,
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

  public onPageChange(event: any): void {
    if (this.pageNumber !== +event.page) {
      this.pageNumber = +event.page;
      this.updateQueryParams();
    }
  }

  public async onSearch() {
    try {
      if (isPlatformBrowser(this.platformId)) {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }

      const contract = {
        itemsPerPage: this.itemsPerPage,
        pageNumber: this.pageNumber,
      };

      if (this.lastSearch) {
        if (this.lastSearch.itemsPerPage == contract.itemsPerPage
          && this.lastSearch.pageNumber == contract.pageNumber) {
          return;
        }
      }

      this.result = await this.api.orders.searchAsync(contract);

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

  private loadQueryParams(params: Params) {
    this.pageNumber = params['pageNumber'] ? +params['pageNumber'] : 1;
    this.itemsPerPage = params['itemsPerPage'] ? +params['itemsPerPage'] : 10;
  }

  private updateQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          pageNumber: this.pageNumber,
          itemsPerPage: this.itemsPerPage,
        },
        queryParamsHandling: 'merge'
      });
  }

}
