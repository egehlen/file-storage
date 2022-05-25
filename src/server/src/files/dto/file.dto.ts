import { File } from "../entities/file.entity";

export class FileDto extends File {
    thumbnailUrl?: string;
}