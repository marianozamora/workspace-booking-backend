import { Logger } from "../../domain/ports";
export declare class PinoLogger implements Logger {
    private readonly logger;
    private createTransport;
    info(message: string, data?: any): void;
    error(message: string, error?: Error, data?: any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
}
