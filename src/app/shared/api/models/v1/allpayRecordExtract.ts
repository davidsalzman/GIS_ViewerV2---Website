import { IAllPayTypeDTO } from "./allPayType";

export interface IAllPayRecordExtractDTO {
    reference: string;
    amount: number;
    type: number;
    line: string;
    typeDTO: IAllPayTypeDTO; 
}
