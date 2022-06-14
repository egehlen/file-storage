export default interface IFile {
    name: string;
    hash: string;
    type: string;
    size: number;
    thumbnail: Buffer;
    visible: boolean;
    selected: boolean;
    processing: boolean;
}