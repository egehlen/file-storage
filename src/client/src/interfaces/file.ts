export default interface File {
    name: string;
    hash: string;
    type: string;
    size: number;
    thumbnail?: Buffer | null;
    visible: boolean;
    selected: boolean;
    processing: boolean;
}