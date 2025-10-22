import { db } from "../index.js";
import { chirps } from "../schema.js";
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
