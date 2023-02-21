import { Injectable } from '@angular/core';

import { ApiAuthService } from './services/api-auth.service';
import { ApiGamesService } from './services/api-games.service';
import { ApiOrdersService } from './services/api-orders.service';
import { ApiUserBasketService } from './services/api-user-basket.service';
import { ApiUsersService } from './services/api-users.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(public auth: ApiAuthService,
        public games: ApiGamesService,
        public orders: ApiOrdersService,
        public userBasket: ApiUserBasketService,
        public users: ApiUsersService) {
    }
}
