export class Account {
    id: string;
    name: string;
    email: string;
    passwordHash: string;

    constructor(dto: { name: string,  email: string,  passwordHash: string }) {
        this.name = dto.name;
        this.email = dto.email;
        this.passwordHash = dto.passwordHash;
    }
}