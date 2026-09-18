import "dotenv/config";
import { db } from "./client";
import { priorities } from "./schema";

async function seed() {
  const names = ["mayor", "intermedio", "menor"];

  for (const name of names) {
    await db.insert(priorities).values({ name }).onDuplicateKeyUpdate({
      set: { name },
    });
  }

  console.log("Seeded priorities:", names.join(", "));
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
