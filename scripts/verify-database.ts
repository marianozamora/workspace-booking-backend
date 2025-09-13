// Script para verificar que la DATABASE_URL funciona
import { PrismaClient } from "@prisma/client";

async function verifyDatabase() {
	const DATABASE_URL = process.env.DATABASE_URL;

	if (!DATABASE_URL) {
		console.error("❌ DATABASE_URL no está definida en .env");
		console.log("💡 Necesitas agregar algo como:");
		console.log(
			'   DATABASE_URL="postgresql://user:password@host:port/database"'
		);
		process.exit(1);
	}

	console.log("🔍 Verificando conexión a la base de datos...");
	console.log(`📍 URL: ${DATABASE_URL.replace(/:[^:@]+@/, ":****@")}`); // Ocultar password

	const prisma = new PrismaClient();

	try {
		// Intentar conectar
		console.log("🔌 Conectando...");
		await prisma.$connect();
		console.log("✅ Conexión exitosa!");

		// Verificar versión de PostgreSQL
		const result = (await prisma.$queryRaw`SELECT version()`) as any[];
		const version = result[0]?.version || "Desconocida";
		console.log(
			`📊 PostgreSQL: ${version.split(" ")[0]} ${version.split(" ")[1]}`
		);

		// Verificar si las tablas existen
		console.log("🔍 Checking database structure...");

		try {
			const spacesCount = await prisma.space.count();
			const bookingsCount = await prisma.booking.count();

			console.log("✅ Tables are accessible:");
			console.log(`   🏢 spaces: ${spacesCount} records`);
			console.log(`   📅 bookings: ${bookingsCount} records`);

			if (spacesCount === 0) {
				console.log('💡 Tip: Run "yarn prisma:seed" for sample data');
			}
		} catch (tableError) {
			console.log("⚠️  Tables don't exist yet");
			console.log("💡 Run: yarn prisma:migrate");
		}

		// Basic write/read test
		console.log("🧪 Testing basic operations...");

		const testId = "test-connection-" + Date.now();

		// Create test record
		await prisma.space.create({
			data: {
				id: testId,
				name: "Test Connection",
				location: "Test",
				capacity: 1,
			},
		});

		// Read record
		const testRecord = await prisma.space.findUnique({
			where: { id: testId },
		});

		if (testRecord) {
			console.log("✅ Write/read operations working");
		}

		// Clean up test record
		await prisma.space.delete({
			where: { id: testId },
		});

		console.log("✅ Cleanup completed");
	} catch (error) {
		console.error("❌ Connection error:", error);

		if (error instanceof Error) {
			if (error.message.includes("ENOTFOUND")) {
				console.log("💡 Database host cannot be resolved");
				console.log("   - Check that the URL is correct");
				console.log("   - Check your internet connection");
			} else if (error.message.includes("ECONNREFUSED")) {
				console.log("💡 Connection refused by server");
				console.log("   - Server might be down");
				console.log("   - Check the port in the URL");
			} else if (error.message.includes("authentication")) {
				console.log("💡 Authentication error");
				console.log("   - Check username and password in the URL");
			} else if (
				error.message.includes("database") &&
				error.message.includes("does not exist")
			) {
				console.log("💡 Database does not exist");
				console.log("   - Create the database in your provider");
			}
		}

		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}

	console.log("🎉 Database verified and working!");
	console.log("");
	console.log("✅ Next steps:");
	console.log("   1. yarn prisma:migrate    # Create tables");
	console.log("   2. yarn prisma:seed       # Sample data");
	console.log("   3. yarn dev               # Start server");
}

// Execute if called directly
if (require.main === module) {
	verifyDatabase().catch(console.error);
}

export { verifyDatabase };
