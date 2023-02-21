import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faSterlingSign } from '@fortawesome/free-solid-svg-icons';

import { IGameDTO } from 'src/app/shared/api/models/v1/game';

import { ApiService } from 'src/app/shared/api/api.service';
import { BasketService } from 'src/app/shared/services/basket.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-game-view-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './game-view-shell.component.html',
  styleUrls: ['./game-view-shell.component.scss']
})
export class GameViewShellComponent implements OnInit {
  faCircle = faCircle;
  faSterlingSign = faSterlingSign;

  public game!: IGameDTO;

  constructor(private api: ApiService,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    private basketService: BasketService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    const gameId = +this.route.snapshot.params['id'];

    if (!gameId) {
      this.router.navigate(['/']);
      return;
    }

    try {
      this.game = await this.api.games.getByIdAsync(gameId);
      this.title.setTitle(`${this.game.name} | Example Website`);
      this.breadcrumbService.breadcrumbs = [{
        name: this.game.name
      }];
    } catch (error) {
      this.messageService.exception(error, 'Failed to load game');
      this.router.navigate(['/']);
    }
  }

  public async onAddToBasket() {
    try {
      await this.basketService.addAsync(this.game);
      this.messageService.success('Added to basket');
    } catch (error) {
      this.messageService.exception(error, 'Failed to add game to basket');
    }
  }
}
