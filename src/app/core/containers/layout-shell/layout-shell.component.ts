import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Route, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBars, faPlus, faUser, faMap, faLock, faGear, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';
import { AuthRoles } from 'src/app/shared/common/auth-roles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { BreadcrumbsComponent } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApiService } from 'src/app/shared/api/api.service';
import { EventService } from 'src/app/shared/services/event.service';
import { UserRoleEnum } from 'src/app/shared/enums/user-role';


export interface IMenuItem {
  name: string;
  icon?: IconProp | undefined;
  url: string[];
  isAdmin: boolean;
}


@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    FontAwesomeModule,
    MenuComponent,
    BreadcrumbsComponent,
    FormsModule,
    MatSidenavModule
  ],
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss']
})
export class LayoutShellComponent implements OnInit, OnDestroy {
  [x: string]: any;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.onScreenWidthChange();
  }

  faPlus = faPlus;
  faBars = faBars;
  faUser = faUser;
  faMap = faMap;
  faLock = faLock;
  faGear = faGear;
  faObjectGroup = faObjectGroup;

  public showMenu = true;
  public authUser: IUserDTO | null = null;
  public isAdmin = false;
  public isNormal = false;
  public isDeveloper = false;
  private lastWidth = 5000;
  private subscriptions: Subscription[] = [];



  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public authService: AuthService, private router: Router,
    private api: ApiService,
    private eventService: EventService,
    private localStorageService: LocalStorageService) {
  }

  async ngOnInit() {
   

    this.onScreenWidthChange();

    try {
      this.authUser = await this.authService.getAuthUser();
      this.isAdmin = this.authUser!.role == UserRoleEnum.Admin;
      this.isNormal = this.authUser!.role == UserRoleEnum.Normal;
      this.isDeveloper = this.authUser!.role == UserRoleEnum.Developer;

    } catch (error) {
      this.authService.logout();
      this.router.navigate(['/', 'login']);
    }

      

    if (!this.authService.hasStartedTimer()) {
      this.authService.startRefresh();
    }

    this.subscriptions.push(this.authService.authChanged.subscribe((user: IUserDTO) => {
      if (user) {
        
        this.authUser = user;
        this.isAdmin = this.authUser.role == UserRoleEnum.Admin;
        this.isNormal = this.authUser.role == UserRoleEnum.Normal;
        this.isDeveloper = this.authUser.role == UserRoleEnum.Developer;
        console.log('role = ' + this.authUser.role);
      }

       
    }));

    
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public setToken(type: string) {
    if (type == 'TJ') {
      this.localStorageService.auth.set({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9tYXMuamFtZXNAc3RyYXRmb3JkLWRjLmdvdi51ayIsImp0aSI6IjdjYmI0MmU1LWM3YjAtNDQ4My05ZmJjLWZhM2I1YmViOWZiOSIsImlhdCI6MTY3NjQ3NjU3MCwiVXNlcklkIjoiMzYzIiwicm9sZSI6WyJXZWJzaXRlIiwiV2Vic2l0ZV9BZG1pbiJdLCJuYmYiOjE2NzY0NzY1NzAsImV4cCI6MTY3NjU2Mjk3MCwiaXNzIjoiU3RyYXRmb3JkRGNTRENCYXlJc3N1ZXIiLCJhdWQiOiJTdHJhdGZvcmREY1NEQ0JheUF1ZGllbmNlIn0.xLeD3aVmNVVc2JONcaJcGBm-2-R47sAKkVaf87063Eg',
        expiresDateTime: dayjs('2023-02-17').toDate()
      });
    } else if (type == 'JL') {
      this.localStorageService.auth.set({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWxpYW4ubG9yZW56QHN0cmF0Zm9yZC1kYy5nb3YudWsiLCJqdGkiOiI4Mzg3YmY5Ni05YTUwLTRlYzEtOGYwOS1mMWZkNGQ0NTUwNTQiLCJpYXQiOjE2NzY1NDMzMDEsIlVzZXJJZCI6IjE3OCIsInJvbGUiOlsiV2Vic2l0ZSIsIldlYnNpdGVfTm9ybWFsIl0sIm5iZiI6MTY3NjU0MzMwMSwiZXhwIjoxNjc2NjI5NzAxLCJpc3MiOiJTdHJhdGZvcmREY1NEQ0JheUlzc3VlciIsImF1ZCI6IlN0cmF0Zm9yZERjU0RDQmF5QXVkaWVuY2UifQ.fR-F10y1Xy9bmEBiftRq2WRhzRVuolc1J4sF8GxoIbg',
        expiresDateTime: dayjs('2023-02-17').toDate()
      });
    }
    this.onRefreshPage();
  }

  public onRefreshPage(): void {
    window.location.reload();
  }

  public showOptions() {
  }
  public onMapViewChange() {
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
