import { NotFoundError } from "../../api/errors.js"; //MORE DOTS!
import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, eq, and } from "drizzle-orm";
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
export async function deleteChirp(chirpID, uuid) {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.id, chirpID), eq(chirps.userId, uuid))) //can only delete if both the user from the token and chirpID match the db row
        .returning();
    if (!result) {
        throw new NotFoundError("Delete chirp failed");
    }
}
export async function chirpsByAuthorId(uuid) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, uuid));
    return result; //return the array so if its all fo tehm
}
