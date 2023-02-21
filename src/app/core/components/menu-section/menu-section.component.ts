import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from 'src/app/shared/services/auth.service';

import { IMenuItem, MenuItemComponent } from '../menu-item/menu-item.component';

export interface IMenuSection {
  name?: string | undefined;
  items: IMenuItem[];
}

@Component({
  selector: 'app-menu-section',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent
  ],
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss']
})
export class MenuSectionComponent implements OnInit {
  @Input() section!: IMenuSection;
  @Input() authenticated = false;
  @Input() authService!: AuthService;
  
  constructor() { }

  ngOnInit(): void {
  }

}
