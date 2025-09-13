#!/usr/bin/env tsx

/**
 * Development helper scripts
 * Usage: npx tsx scripts/dev-helpers.ts [command]
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const commands = {
	// Complete initial setup
	setup: async () => {
		console.log("🚀 Initial project setup...");

		// 1. Check Docker
		try {
			execSync("docker --version", { stdio: "ignore" });
			console.log("✅ Docker installed");
		} catch {
			console.error("❌ Docker not found. Install Docker Desktop first.");
			process.exit(1);
		}

		// 2. Create .env if it doesn't exist
		if (!fs.existsSync(".env")) {
			if (fs.existsSync(".env.example")) {
				fs.copyFileSync(".env.example", ".env");
				console.log("✅ .env file created from .env.example");
			} else {
				const defaultEnv = `NODE_ENV=development
PORT=3000
HOST=0.0.0.0
DATABASE_URL="postgresql://booking_user:booking_password@localhost:5432/booking_development"
API_KEY="dev-api-key-change-in-production"
LOG_LEVEL=debug
FRONTEND_URL="http://localhost:3001"`;

				fs.writeFileSync(".env", defaultEnv);
				console.log("✅ .env file created with default values");
			}
		} else {
			console.log("⚠️  .env already exists, not overwriting");
		}

		// 3. Install dependencies
		console.log("📦 Installing dependencies...");
		execSync("yarn install", { stdio: "inherit" });

		// 4. Start Docker
		console.log("🐳 Starting PostgreSQL with Docker...");
		execSync("docker-compose -f docker-compose.dev.yml up -d", {
			stdio: "inherit",
		});

		// Wait for PostgreSQL to be ready
		console.log("⏳ Waiting for PostgreSQL to be ready...");
		await sleep(3000);

		// 5. Database setup
		console.log("🗄️ Setting up database...");
		execSync("yarn prisma:generate", { stdio: "inherit" });
		execSync("yarn prisma:migrate", { stdio: "inherit" });
		execSync("yarn prisma:seed", { stdio: "inherit" });

		console.log("");
		console.log("🎉 Setup completed!");
		console.log("");
		console.log("📋 Next steps:");
		console.log("   yarn dev                 # Start server");
		console.log("   yarn test                # Run tests");
		console.log("   make stop                # Stop everything");
	},

	// Start development
	start: () => {
		console.log("🚀 Starting development environment...");

		// Check if Docker is running
		try {
			execSync("docker-compose -f docker-compose.dev.yml ps", {
				stdio: "ignore",
			});
		} catch {
			console.log("🐳 Starting PostgreSQL...");
			execSync("docker-compose -f docker-compose.dev.yml up -d", {
				stdio: "inherit",
			});
		}

		// Start server
		console.log("⚡ Starting server...");
		execSync("yarn dev", { stdio: "inherit" });
	},

	// Stop everything
	stop: () => {
		console.log("🛑 Stopping development environment...");

		try {
			execSync("docker-compose -f docker-compose.dev.yml down", {
				stdio: "inherit",
			});
			console.log("✅ PostgreSQL stopped");
		} catch (error) {
			console.log("⚠️  Error stopping Docker:", error);
		}

		console.log("✅ Environment stopped");
	},

	// Database reset
	"db:reset": () => {
		console.log("🔄 Resetting database...");
		console.log("⚠️  This will delete all data!");

		// Confirm
		const readline = require("readline");
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question("Continue? (y/N): ", (answer: string) => {
			if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
				try {
					execSync("yarn prisma:migrate reset --force", {
						stdio: "inherit",
					});
					execSync("yarn prisma:seed", { stdio: "inherit" });
					console.log("✅ Database reset");
				} catch (error) {
					console.error("❌ Error resetting DB:", error);
				}
			} else {
				console.log("❌ Operation cancelled");
			}
			rl.close();
		});
	},

	// Local database backup
	"db:backup": () => {
		const timestamp = new Date()
			.toISOString()
			.replace(/[:.]/g, "-")
			.split("T")[0];
		const filename = `backup-local-${timestamp}.sql`;

		console.log(`💾 Creating backup: ${filename}`);

		try {
			execSync(
				`docker exec booking-postgres-dev pg_dump -U booking_user booking_development > ${filename}`,
				{ stdio: "inherit" }
			);
			console.log(`✅ Backup created: ${filename}`);
		} catch (error) {
			console.error("❌ Error creating backup:", error);
		}
	},

	// Restore backup
	"db:restore": (filename?: string) => {
		if (!filename) {
			console.error("❌ Specify file: yarn db:restore backup.sql");
			return;
		}

		if (!fs.existsSync(filename)) {
			console.error(`❌ File not found: ${filename}`);
			return;
		}

		console.log(`📥 Restoring from: ${filename}`);

		try {
			// Reset first
			execSync("yarn prisma:migrate reset --force", { stdio: "inherit" });

			// Restore
			execSync(
				`docker exec -i booking-postgres-dev psql -U booking_user -d booking_development < ${filename}`,
				{ stdio: "inherit" }
			);

			console.log("✅ Restoration completed");
		} catch (error) {
			console.error("❌ Error restoring:", error);
		}
	},

	// Development logs
	logs: () => {
		console.log("📋 PostgreSQL logs:");
		execSync("docker-compose -f docker-compose.dev.yml logs -f postgres", {
			stdio: "inherit",
		});
	},

	// System status
	status: () => {
		console.log("📊 Development system status:");
		console.log("");

		// Docker status
		console.log("🐳 Docker Services:");
		try {
			execSync("docker-compose -f docker-compose.dev.yml ps", {
				stdio: "inherit",
			});
		} catch {
			console.log("   No services running");
		}

		console.log("");

		// Check DB connection
		console.log("🗄️  Database:");
		try {
			execSync("yarn db:verify", { stdio: "inherit" });
		} catch {
			console.log("   ❌ Cannot connect to database");
		}

		console.log("");

		// Ports
		console.log("🔌 Ports in use:");
		try {
			execSync("lsof -i :3000 -i :5432", { stdio: "inherit" });
		} catch {
			console.log("   No ports 3000 or 5432 in use");
		}
	},

	// Complete test (comentado para enfoque en desarrollo local)
	/*
	"test:all": () => {
		console.log("🧪 Running all tests...");

		// Ensure test DB is running
		try {
			execSync("docker-compose -f docker-compose.test.yml up -d", {
				stdio: "inherit",
			});
		} catch {
			console.log("⚠️  Could not start test DB, using development DB");
		}

		// Run tests
		execSync("yarn test:coverage", { stdio: "inherit" });
	},
	*/

	// Deploy preview (comentado para enfoque en desarrollo local)
	/*
	"deploy:preview": () => {
		console.log("🚀 Creating deploy preview...");

		// Check for uncommitted changes
		try {
			const status = execSync("git status --porcelain", { encoding: "utf-8" });
			if (status.trim()) {
				console.log("⚠️  There are uncommitted changes:");
				console.log(status);
				console.log("Commit first or use --force");
				return;
			}
		} catch (error) {
			console.error("❌ Error checking git status:", error);
			return;
		}

		// Push to preview branch
		const branch = `preview-${Date.now()}`;
		execSync(`git checkout -b ${branch}`, { stdio: "inherit" });
		execSync(`git push origin ${branch}`, { stdio: "inherit" });

		console.log(`✅ Preview branch created: ${branch}`);
		console.log("🔗 Railway will deploy automatically in ~2-3 minutes");

		// Return to main
		execSync("git checkout main", { stdio: "inherit" });
		execSync(`git branch -d ${branch}`, { stdio: "inherit" });
	},
	*/

	// Help
	help: () => {
		console.log("🛠️  Available commands for local development:");
		console.log("");
		console.log("   setup           Complete initial setup with Docker");
		console.log("   start           Start development environment");
		console.log("   stop            Stop everything");
		console.log("   status          View system status");
		console.log("   logs            View PostgreSQL logs");
		console.log("");
		console.log("   db:reset        Reset database");
		console.log("   db:backup       Backup local DB");
		console.log("   db:restore      Restore backup");
		console.log("");
		console.log("Usage: npx tsx scripts/dev-helpers.ts [command]");
		console.log("");
		console.log("💡 For more commands, use: make help");
	},
};

// Utility functions
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Main execution
const command = process.argv[2] as keyof typeof commands;
const args = process.argv.slice(3);

if (!command || !commands[command]) {
	commands.help();
	process.exit(1);
}

// Execute command
try {
	await commands[command](...args);
} catch (error) {
	console.error("❌ Error executing command:", error);
	process.exit(1);
}
