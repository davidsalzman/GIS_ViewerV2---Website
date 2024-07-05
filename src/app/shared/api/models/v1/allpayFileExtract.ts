import { IAllPayTypeDTO } from "./allPayType";
import { IAllPayRecordExtractDTO } from "./allpayRecordExtract";

export interface IAllPayFileExtractDTO {
    name: string;
    createdDateUTC: Date;
    allPayId: string;
    totalRecords: number;
    totalAmount: number;
    type: number;
    typeDTO: IAllPayTypeDTO;
    allPayRecords: IAllPayRecordExtractDTO[];
    duplicatedFiles: number[];
    processedDateUTC: Date;
    expanded: boolean;
}
