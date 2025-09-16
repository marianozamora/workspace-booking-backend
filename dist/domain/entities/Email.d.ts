export declare class Email {
    private readonly value;
    private constructor();
    static create(email: string): Email;
    private static isValid;
    getValue(): string;
}
