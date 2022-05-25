
export const isNullOrEmpty = function(value: string): boolean {
    try {
        return value == null || value == undefined || value?.trim() == '';
    } catch {
        return true;
    }
}

export const getThumbnailName = function(originalFileName: string): string {
    if (this.isNullOrEmpty(originalFileName))
        return originalFileName;

    const fileNameParts = originalFileName.split('.');
    const extension = fileNameParts.pop();
    return `${fileNameParts.join('.')}_thumb.${extension}`;
}