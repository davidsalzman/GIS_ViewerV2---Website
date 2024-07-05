export interface IExportDTO {
    id: number;
    name: string;
    siteId: number;
    filename: string;
    zipname: string;
    description: string;
    source: string;
    destination: string;
    eod: boolean;
    eodString: string;
    isActive: boolean;
}