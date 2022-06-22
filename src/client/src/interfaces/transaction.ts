export default interface Transaction {
    hash: string;
    correlationId: string;
    operation: string;
    done: boolean;
    success: boolean;
    message: string;
    error: string;
}