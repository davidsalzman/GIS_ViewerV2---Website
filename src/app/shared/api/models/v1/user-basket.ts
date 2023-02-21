import { IGameDTO } from './game';

export interface IUserBasketDTO {
    quantity: number;
    game: IGameDTO;
}