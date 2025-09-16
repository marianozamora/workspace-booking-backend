import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

async function checkAndSetup() {
	try {
		console.log("🔍 Checking database status...");
		
		// Try to connect to database
		await prisma.$connect();
		console.log("✅ Database connection successful");
		
		// Check if tables exist by trying to count spaces
		try {
			const spaceCount = await prisma.space.count();
			console.log(`✅ Database tables exist. Found ${spaceCount} spaces`);
			
			// If no data exists, run seed
			if (spaceCount === 0) {
				console.log("🌱 No data found, running seed...");
				execSync("yarn railway:seed", { stdio: "inherit" });
			} else {
				console.log("✅ Database already has data, skipping seed");
			}
		} catch (error) {
			console.log("⚠️  Tables don't exist, running full setup...");
			execSync("yarn railway:setup", { stdio: "inherit" });
		}
		
	} catch (error) {
		console.log("❌ Database connection failed, running full setup...");
		console.log("Error:", error);
		execSync("yarn railway:setup", { stdio: "inherit" });
	} finally {
		await prisma.$disconnect();
	}
}

checkAndSetup().catch(error => {
	console.error("❌ Railway check failed:", error);
	process.exit(1);
});