import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from 'src/app/shared/services/auth.service';

export interface IMenuItem {
  name: string;
  icon?: IconProp | undefined;
  url?: string[] | undefined;
  subMenu?: IMenuItem[] | undefined;
  requireAuth?: boolean | undefined;
  requiredRole?: string | undefined;
}

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  faAngleRight = faAngleRight;
  faAngleDown = faAngleDown;
  faCircle = faCircle;

  @Input() item!: IMenuItem;
  @Input() isSubMenu = false;
  @Input() show = false;
  @Input() authenticated = false;
  @Input() authService!: AuthService;

  public showSubMenu = false;
  public hasRole = false;
  constructor() { }

  ngOnInit(): void {
    if (this.item.requiredRole) {
      this.hasRole = this.authService.hasRole(this.item.requiredRole);
    } else {
      this.hasRole = true;
    }
  }

  public onToggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }

}
