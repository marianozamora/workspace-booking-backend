import pino from "pino";
import { Logger } from "@/domain/ports";

export class PinoLogger implements Logger {
	private readonly logger = pino({
		level: process.env.LOG_LEVEL || "info",
		transport:
			process.env.NODE_ENV === "development" ? this.createTransport() : undefined,
	});

	private createTransport() {
		try {
			// Try to use pino-pretty if available
			require.resolve("pino-pretty");
			return {
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			};
		} catch {
			// Fallback to standard JSON logging if pino-pretty is not available
			console.warn("⚠️  pino-pretty not found, using standard JSON logging");
			return undefined;
		}
	}

	info(message: string, data?: any): void {
		this.logger.info(data, message);
	}

	error(message: string, error?: Error, data?: any): void {
		this.logger.error({ err: error, ...data }, message);
	}

	warn(message: string, data?: any): void {
		this.logger.warn(data, message);
	}

	debug(message: string, data?: any): void {
		this.logger.debug(data, message);
	}
}
