"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(email) {
        if (!this.isValid(email)) {
            throw new Error("Invalid email format");
        }
        return new Email(email.toLowerCase().trim());
    }
    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    getValue() {
        return this.value;
    }
}
exports.Email = Email;
