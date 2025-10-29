import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getUserData(uuid) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, uuid));
    return result;
}
export async function updateUserEmailPwd(user) {
    await db
        .update(users)
        .set({
        email: user.email,
        hashedPassword: user.hashedPassword,
        isChirpyRed: user.isChirpyRed
    })
        .where(eq(users.id, user.id));
}
export async function upgradeChirpyRed(userID) {
    await db
        .update(users)
        .set({
        isChirpyRed: true
    })
        .where(eq(users.id, userID));
}
