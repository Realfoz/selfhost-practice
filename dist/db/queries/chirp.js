import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";
export async function createChirp(chirp, user) {
    const [result] = await db
        .insert(chirps)
        .values({
        body: chirp,
        userId: user
    })
        .returning();
    return result; //removed from the array here
}
export async function getAllChirps() {
    const results = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return results;
}
export async function getChirp(chirpID) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpID));
    return result;
}
