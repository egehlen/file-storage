import File from "interfaces/file";

export default interface FileListProps {
    files: File[];
    loaded: boolean;
    onSelectionToggleSingle: (hash: string) => void;
}