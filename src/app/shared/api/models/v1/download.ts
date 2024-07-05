export interface IDownloadDTO {
    exportId: number;
    exportName: string;
    fileName: string;
    lastModified: string;
    fileSize: string;
    downloadFile: File;
}
