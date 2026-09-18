"use server";

import { db } from "@/db/client";
import { priorities } from "@/db/schema";

export async function getPriorities() {
  return db.select().from(priorities);
}
