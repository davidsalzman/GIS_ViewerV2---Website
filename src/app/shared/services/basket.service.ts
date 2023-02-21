import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { ApiService } from '../api/api.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

import { IGameDTO } from '../api/models/v1/game';
import { IUserBasketDTO } from '../api/models/v1/user-basket';

@Injectable({
    providedIn: 'root',
})
export class BasketService {
    public basket$: Observable<IUserBasketDTO[]>;
    private basketSubject: Subject<IUserBasketDTO[]>;
    private _basket: IUserBasketDTO[] = [];

    constructor(private authService: AuthService,
        private api: ApiService,
        private localStorageService: LocalStorageService) {
        this.basketSubject = new Subject<IUserBasketDTO[]>();
        this.basket$ = this.basketSubject.asObservable();
    }

    public getBasket(): IUserBasketDTO[] {
        return this._basket;
    }

    private set basket(basket: IUserBasketDTO[]) {
        this._basket = basket;
        this.basketSubject.next(basket);
        this.localStorageService.basket.set(basket);
    }

    /**
     * Adds the game to the basket, if the game already exists one is added to the quantity
     * @param game Game to add
     */
    public async addAsync(game: IGameDTO) {
        if (this.authService.isAuthenticated()) {
            await this.api.userBasket.addAsync({
                gameId: game.id
            });
            this.loadBasketAsync();
        } else {
            const basket = this.getBasket();
            const existsIndex = basket.findIndex(x => x.game.id == game.id);

            if (existsIndex > -1) {
                basket[existsIndex].quantity++;
            } else {
                basket.push({
                    game,
                    quantity: 1
                });
            }

            this.basket = basket;
        }
    }

    /**
     * Remove a game from the basket - default will remove 1 from quantity and remove game if quantity = 0
     * @param game Game to remove
     * @param removeAll If [True] no matter what the quantity is the game will be removed from the basket
     */
    public async removeAsync(game: IGameDTO, removeAll = false) {
        if (this.authService.isAuthenticated()) {
            await this.api.userBasket.removeAsync({
                gameId: game.id
            });
            this.loadBasketAsync();
        } else {
            let basket = this.getBasket();

            const existsIndex = basket.findIndex(x => x.game.id == game.id);

            if (existsIndex > -1) {
                basket[existsIndex].quantity--;

                if (removeAll || basket[existsIndex].quantity == 0) {
                    basket = basket.filter(x => x.game.id != game.id);
                }
            }

            this.basket = basket;
        }
    }

    /**
     * Clears the basket
     */
    public async emptyAsync() {
        if (this.authService.isAuthenticated()) {
            await this.api.userBasket.emptyAsync();
        }

        this.basket = [];
    }

    /**
     * Loads the basket from the API if the user is 
     * authenticated else from local storage
     */
    public async loadBasketAsync() {
        if (this.authService.isAuthenticated()) {
            this.basket = await this.api.userBasket.getByAuthAsync();
        } else {
            this.basket = this.localStorageService.basket.get();
        }
    }
}