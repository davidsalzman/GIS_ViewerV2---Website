import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faChartPie, faHome, faLock, faShoppingBasket, faUser } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs/internal/Subscription';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';
import { IUserBasketDTO } from 'src/app/shared/api/models/v1/user-basket';
import { AuthRoles } from 'src/app/shared/common/auth-roles';

import { AuthService } from 'src/app/shared/services/auth.service';
import { BasketService } from 'src/app/shared/services/basket.service';

import { BreadcrumbsComponent } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';
import { SplashScreenComponent } from 'src/app/shared/components/splash-screen/splash-screen.component';
import { IMenuSection, MenuSectionComponent } from '../../components/menu-section/menu-section.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MenuSectionComponent,    
    BreadcrumbsComponent,
    SplashScreenComponent,
  ],
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss']
})
export class LayoutShellComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.onScreenWidthChange();
  }

  faBars = faBars;
  faUser = faUser;
  faLock = faLock;
  faShoppingBasket = faShoppingBasket;

  public showMenu = true;
  public user: IUserDTO | null = null;
  public basketQuantity: number = 0;
  public showSplashScreen = true;

  public menu: IMenuSection[] = [{
    items: [{
      name: 'Charts',
      icon: faChartPie,
      url: ['/', 'chart']
    }, {
      name: 'View Orders',
      icon: faHome,
      url: ['/', 'order'],
      requireAuth: true
    }]
  }, {
    items: [{
      name: 'Users',
      icon: faUser,
      url: ['/', 'user'],
      requireAuth: true,
      requiredRole: AuthRoles.WEBSITE_ADMIN
    }]
  }, {
    name: 'Menu Section Title',
    items: [{
      name: 'Something',
      icon: faHome,
      subMenu: [{
        name: 'Something Sub',
        url: ['/']
      }, {
        name: 'Something Sub 2',
        url: ['/']
      }]
    }, {
      name: 'Some other section',
      icon: faHome,
      subMenu: [{
        name: 'Something abc',
        url: ['/']
      }, {
        name: 'Something xyz',
        url: ['/']
      }]
    }]
  }];

  private lastWidth = 5000;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public authService: AuthService,
    private basketService: BasketService) { }

  async ngOnInit() {
    this.onScreenWidthChange();

    this.user = this.authService.getUser();
    this.subscriptions.push(this.authService.user$.subscribe((user: IUserDTO | null) => {
      this.user = user;
      this.basketService.loadBasketAsync();
    }));

    if (this.authService.isAuthenticated()) {
      this.authService.startRefreshAsync();
    }
    await this.basketService.loadBasketAsync();

    const basket = this.basketService.getBasket();
    this.loadBasket(basket);

    this.subscriptions.push(this.basketService.basket$.subscribe((basket: IUserBasketDTO[]) => {
      this.loadBasket(basket);
    }));

    this.showSplashScreen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private loadBasket(basket: IUserBasketDTO[]) {
    this.basketQuantity = 0;
    for (let item of basket) {
      this.basketQuantity += item.quantity;
    }
  }

  private onScreenWidthChange() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.showMenu && window.innerWidth < 993 && this.lastWidth > 992) {
        this.showMenu = false;
      } else if (!this.showMenu && window.innerWidth > 992 && this.lastWidth < 993) {
        this.showMenu = true;
      }

      this.lastWidth = window.innerWidth;
    }
  }

}
