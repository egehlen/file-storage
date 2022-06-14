import { UploadItemStatus } from "enums/UploadItemStatus";

class FileUploadItem {
    constructor(_id: string, _fileName: string, _content: File) {
        this.id = _id;
        this.fileName = _fileName;
        this.content = _content;
    }

    public id: string = '';
    public fileName: string = '';
    public content: File | null = null;
    public progress: number = 0;
    public error: string = '';
    public status: UploadItemStatus = UploadItemStatus.queued;
    public message: string = '';
}

export default FileUploadItem;