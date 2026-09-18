import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionUri = process.env.DATABASE_URL;

if (!connectionUri) {
  throw new Error("DATABASE_URL is not set");
}

const poolConnection = mysql.createPool(connectionUri);

export const db = drizzle(poolConnection, { schema, mode: "default" });
