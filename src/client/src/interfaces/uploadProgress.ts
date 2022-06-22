export default interface UploadProgress {
    correlationId: string;
    progress: number;
    message: string;
}