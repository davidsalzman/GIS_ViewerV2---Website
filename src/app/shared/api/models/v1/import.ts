export interface IImportDTO {
    id: number;
    name: string;
    siteId: number;
    filename: string;
    zipname: string;
    description: string;
    source: string;
    destination: string;
    eodString: string;
    isActive: boolean;
}