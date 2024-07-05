import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight, faHome } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

export interface IBreadcrumb {
  name: string;
  icon?: IconProp;
  url?: any[];
 
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  faAngleRight = faAngleRight;
  public breadcrumbs: IBreadcrumb[] = [{
    name: 'Home',
    icon: faHome
    
  }];

  private subscriptions: Subscription[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {
    const breadcrumbs = this.breadcrumbService.getBreadcrumbs();
    if (breadcrumbs) {
      breadcrumbs.unshift({
        name: 'Home',
        icon: faHome,
        url: ['/']
      });

      this.breadcrumbs = breadcrumbs;
    } else {
      this.breadcrumbs = [{
        name: 'Home',
        icon: faHome
      }]
    }
    this.subscriptions.push(this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs: IBreadcrumb[] | null) => {
      if (breadcrumbs) {
        breadcrumbs.unshift({
          name: 'Home',
          icon: faHome,
          url: ['/']
        });

        this.breadcrumbs = breadcrumbs;
      } else {
        this.breadcrumbs = [{
          name: 'Home',
          icon: faHome
          
        }]
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
