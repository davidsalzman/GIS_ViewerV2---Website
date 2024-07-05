export interface IUploadDTO {
    importId: number;
    importName: string;
    fileName: string;
    lastModified: string;
    fileSize: string;
    uploadFile: File;
}
