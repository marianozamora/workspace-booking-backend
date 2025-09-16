import { beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";

// Global test setup
beforeAll(async () => {
	// Setup test environment
	process.env.NODE_ENV = "test";
	process.env.API_KEY = "test-api-key";
	process.env.DATABASE_URL = "file:./test.db";
});

afterAll(async () => {
	// Cleanup after all tests
});

beforeEach(async () => {
	// Setup before each test
});

afterEach(async () => {
	// Cleanup after each test
});

// Mock console methods in test environment
if (process.env.NODE_ENV === "test") {
	global.console = {
		...console,
		log: jest.fn(),
		error: jest.fn(),
		warn: jest.fn(),
		info: jest.fn(),
	};
}
