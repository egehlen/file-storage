export default interface CommandBarProps {
    title: string;
    selectedCount: number;
    totalCount: number;
    onDeleteRequest: () => void
    onSelectionToggleAll: (selectAll: boolean) => void
}