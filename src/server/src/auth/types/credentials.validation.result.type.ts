import { Account } from "@prisma/client";

export type CredentialsValidationResult = {
    valid: boolean;
    account: Account;
}