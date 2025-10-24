import { asc } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function getAllChirps() {
    const results = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return results;
}
