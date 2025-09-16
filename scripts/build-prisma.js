#!/usr/bin/env node

/**
 * Build script for Prisma generation that handles missing DATABASE_URL
 * This script is designed to work in both local and Railway build environments
 */

const { execSync } = require("child_process");

// Default/dummy DATABASE_URL for build-time generation
const DEFAULT_DATABASE_URL =
	"postgresql://user:password@localhost:5432/defaultdb";

function buildPrisma() {
	try {
		// Check if DATABASE_URL exists and is not empty
		let databaseUrl = process.env.DATABASE_URL;

		if (!databaseUrl || databaseUrl.trim() === "") {
			console.log("⚠️  DATABASE_URL not found, using default for build...");
			databaseUrl = DEFAULT_DATABASE_URL;
		} else {
			console.log("✓ Using existing DATABASE_URL");
		}

		console.log("🔧 Generating Prisma client...");

		// Generate Prisma client with the appropriate DATABASE_URL
		execSync("npx prisma generate", {
			stdio: "inherit",
			env: {
				...process.env,
				DATABASE_URL: databaseUrl,
			},
		});

		console.log("✅ Prisma client generated successfully");
	} catch (error) {
		console.error("❌ Failed to generate Prisma client:", error.message);
		console.error("This might be due to:");
		console.error("- Missing Prisma CLI");
		console.error("- Invalid Prisma schema");
		console.error("- Network issues during generation");
		process.exit(1);
	}
}

// Only run if this script is executed directly
if (require.main === module) {
	buildPrisma();
}

module.exports = { buildPrisma };
