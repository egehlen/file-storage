import axios from "axios";
import { UserFile } from "types/types.UserFiles";
import IFile from "interfaces/IFile";
import settings from 'settings.json';

class FilesService {
    private apiEndpoint: string | undefined;

    constructor() {
        this.apiEndpoint = settings.files_api;
    }

    public async getAll(senderAddress: string) : Promise<IFile[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let files : IFile[] = [];
                const result : any = await axios.get(`${this.apiEndpoint}/all`, { params: { sender: senderAddress } });

                if (result && result.data && result.data.length) {
                    files = result.data.map((file : any) => {
                        return {
                            name: file.name,
                            hash: file.hash,
                            type: file.type,
                            size: file.size,
                            thumbnail: file.thumbnailContent,
                            visible: true,
                            selected: false,
                            processing: false
                        };
                    });

                    resolve(files);
                }
                else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public async delete(senderAddress: string, fileHash: string) : Promise<string> {
        return new Promise(async(resolve, reject) => {
            try {
                const result : any = await axios.post(`${this.apiEndpoint}/remove`, { sender: senderAddress, hash: fileHash });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    public upload(senderAddress: string, correlationId: string, file: any) {
        let formData = new FormData();
        formData.append('sender', senderAddress);
        formData.append('correlation-id', correlationId);
        formData.append('file', file);

        let config = { headers: { "Content-Type": "multipart/form-data", } };
        return axios.post(`${this.apiEndpoint}/upload`, formData, config);
    }
}

export default FilesService;