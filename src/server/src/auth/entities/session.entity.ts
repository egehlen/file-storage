export class Session {
    id: string;
    token: string;
    createdAt: Date;

    constructor(token: string) {
        this.token = token;
        this.createdAt = new Date();
    }
}