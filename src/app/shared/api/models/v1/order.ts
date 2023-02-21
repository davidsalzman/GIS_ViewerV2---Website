import { OrderStatusEnum } from 'src/app/shared/enums/order-status';

import { IGameKeyDTO } from './game-key';

export interface IOrderDTO {
    id: number;
    name: string;
    email: string;
    totalCharge: number;
    statusId: OrderStatusEnum;
    userId: number;
    keys: IGameKeyDTO[];
}