import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seeding...");

	// Clean existing data
	console.log("🧹 Cleaning existing data...");
	await prisma.booking.deleteMany();
	await prisma.space.deleteMany();

	// Create spaces
	console.log("🏢 Creating spaces...");
	const spaces = await Promise.all([
		prisma.space.create({
			data: {
				name: "Conference Room Alpha",
				location: "Floor 1, North Wing",
				capacity: 12,
				description:
					"Large conference room with projector and whiteboard. Perfect for team meetings and presentations.",
				active: true,
			},
		}),
		prisma.space.create({
			data: {
				name: "Meeting Room Beta",
				location: "Floor 1, South Wing",
				capacity: 6,
				description:
					"Small meeting room ideal for team discussions and video calls.",
				active: true,
			},
		}),
		prisma.space.create({
			data: {
				name: "Focus Pod Gamma",
				location: "Floor 2, East Wing",
				capacity: 2,
				description: "Quiet pod for focused work or 1-on-1 meetings.",
				active: true,
			},
		}),
		prisma.space.create({
			data: {
				name: "Training Room Delta",
				location: "Floor 2, West Wing",
				capacity: 20,
				description:
					"Large training room with multimedia equipment and flexible seating.",
				active: true,
			},
		}),
		prisma.space.create({
			data: {
				name: "Creative Lab",
				location: "Floor 3, Center",
				capacity: 8,
				description:
					"Creative workspace with whiteboards, sticky notes, and brainstorming tools.",
				active: true,
			},
		}),
	]);

	console.log(`✅ Created ${spaces.length} spaces`);

	// Create sample bookings
	console.log("📅 Creating sample bookings...");
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const nextWeek = new Date(today);
	nextWeek.setDate(nextWeek.getDate() + 7);

	const bookings = await Promise.all([
		// Today's bookings
		prisma.booking.create({
			data: {
				spaceId: spaces[0].id, // Conference Room Alpha
				clientEmail: "alice@company.com",
				date: today,
				startTime: "09:00",
				endTime: "10:30",
				status: "ACTIVE",
			},
		}),
		prisma.booking.create({
			data: {
				spaceId: spaces[1].id, // Meeting Room Beta
				clientEmail: "bob@company.com",
				date: today,
				startTime: "11:00",
				endTime: "12:00",
				status: "ACTIVE",
			},
		}),

		// Tomorrow's bookings
		prisma.booking.create({
			data: {
				spaceId: spaces[2].id, // Focus Pod Gamma
				clientEmail: "charlie@company.com",
				date: tomorrow,
				startTime: "14:00",
				endTime: "15:30",
				status: "ACTIVE",
			},
		}),
		prisma.booking.create({
			data: {
				spaceId: spaces[3].id, // Training Room Delta
				clientEmail: "diana@company.com",
				date: tomorrow,
				startTime: "09:00",
				endTime: "17:00",
				status: "ACTIVE",
			},
		}),

		// Next week's bookings
		prisma.booking.create({
			data: {
				spaceId: spaces[4].id, // Creative Lab
				clientEmail: "eve@company.com",
				date: nextWeek,
				startTime: "10:00",
				endTime: "12:00",
				status: "ACTIVE",
			},
		}),

		// Some cancelled booking for testing
		prisma.booking.create({
			data: {
				spaceId: spaces[0].id, // Conference Room Alpha
				clientEmail: "frank@company.com",
				date: nextWeek,
				startTime: "15:00",
				endTime: "16:00",
				status: "CANCELLED",
			},
		}),
	]);

	console.log(`✅ Created ${bookings.length} bookings`);

	// Print summary
	console.log("\n📊 Database seeding completed!");
	console.log("┌─────────────────────────────────────┐");
	console.log("│ Summary:                            │");
	console.log(`│ • Spaces: ${spaces.length.toString().padStart(25)} │`);
	console.log(`│ • Bookings: ${bookings.length.toString().padStart(23)} │`);
	console.log("└─────────────────────────────────────┘");

	console.log("\n🎯 Test data includes:");
	console.log("• Various room types (conference, meeting, focus pods)");
	console.log("• Bookings for today, tomorrow, and next week");
	console.log("• Different booking statuses (active, cancelled)");
	console.log("• Realistic time slots and user emails");
}

main()
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
