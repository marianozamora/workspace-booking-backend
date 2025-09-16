"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoLogger = void 0;
const pino_1 = __importDefault(require("pino"));
class PinoLogger {
    constructor() {
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL || "info",
            transport: process.env.NODE_ENV === "development" ? this.createTransport() : undefined,
        });
    }
    createTransport() {
        try {
            require.resolve("pino-pretty");
            return {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            };
        }
        catch {
            console.warn("⚠️  pino-pretty not found, using standard JSON logging");
            return undefined;
        }
    }
    info(message, data) {
        this.logger.info(data, message);
    }
    error(message, error, data) {
        this.logger.error({ err: error, ...data }, message);
    }
    warn(message, data) {
        this.logger.warn(data, message);
    }
    debug(message, data) {
        this.logger.debug(data, message);
    }
}
exports.PinoLogger = PinoLogger;
