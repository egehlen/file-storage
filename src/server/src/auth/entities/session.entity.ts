export class Session {
    id: number;
    token: string;
    createdAt: Date;

    constructor(token: string) {
        this.token = token;
        this.createdAt = new Date();
    }
}