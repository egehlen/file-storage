import IFile from "interfaces/IFile";

export default interface IFileListProps {
    files: IFile[];
    loaded: boolean;
    onSelectionToggleSingle: (hash: string) => void;
}