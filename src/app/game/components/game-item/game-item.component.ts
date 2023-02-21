import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faSterlingSign } from '@fortawesome/free-solid-svg-icons';

import { IGameDTO } from 'src/app/shared/api/models/v1/game';

@Component({
  selector: 'app-game-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {
  faCircle = faCircle;
  faSterlingSign = faSterlingSign;

  @Input() game!: IGameDTO;

  public imageUrl: string | null = null;

  constructor() { }

  ngOnInit(): void {
    if (this.game.images && this.game.images.length > 0) {
      this.imageUrl = this.game.images[0];
    }
  }

}
