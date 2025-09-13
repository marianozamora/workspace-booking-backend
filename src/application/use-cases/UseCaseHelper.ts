export interface Repository<T> {
	findById(id: string): Promise<T | null>;
	existsById(id: string): Promise<boolean>;
}

export interface Logger {
	info(message: string, data?: any): void;
	error(message: string, error?: Error, data?: any): void;
}

export class UseCaseHelper {
	// Generic method to get entity or throw
	static async getEntityOrThrow<T>(
		repository: Repository<T>,
		id: string,
		entityName: string = "Entity"
	): Promise<T> {
		const entity = await repository.findById(id);
		if (!entity) {
			throw new Error(`${entityName} not found`);
		}
		return entity;
	}

	// Generic method to check if entity exists or throw
	static async ensureEntityExists(
		repository: Repository<any>,
		id: string,
		entityName: string = "Entity"
	): Promise<void> {
		const exists = await repository.existsById(id);
		if (!exists) {
			throw new Error(`${entityName} not found`);
		}
	}

	// Logging wrapper for operations
	static async loggedOperation<T>(
		logger: Logger,
		operationName: string,
		params: any,
		operation: () => Promise<T>
	): Promise<T> {
		logger.info(`Starting ${operationName}`, params);

		try {
			const result = await operation();
			logger.info(`${operationName} completed successfully`, params);
			return result;
		} catch (error) {
			logger.error(`Error in ${operationName}`, error as Error, params);
			throw error;
		}
	}

	// Generate UUID helper
	static generateId(): string {
		return crypto.randomUUID();
	}
}
