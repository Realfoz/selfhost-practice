import { UnauthorizedError } from "../../api/errors.js";
import { db } from "../index.js";
import { users, refresh_tokens } from "../schema.js";
import { eq, and, gt, isNull } from "drizzle-orm"; //gt is greater than filter
export async function hashRetrievel(userEmail) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail))
        .limit(1);
    return result;
}
export async function checkUUID(UUID) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, UUID))
        .limit(1);
    if (!result) { //if it fails to find a row with that uuid the query returns an empty array so results is undefined/falsy 
        throw new UnauthorizedError("Bad Token! Please log in");
    }
}
export async function addRefreshToken(userData) {
    const sixtyDayTimer = new Date(Date.now() + 5184000000); //60 days in ms added
    await db
        .insert(refresh_tokens)
        .values({
        token: userData.refreshToken,
        userId: userData.id,
        expiresAt: sixtyDayTimer,
    });
}
export async function getUserFromRefreshToken(currentToken) {
    const [result] = await db
        .select({ userId: refresh_tokens.userId }) //selects just the UUID for this token if its valid
        .from(refresh_tokens)
        .where(and(eq(refresh_tokens.token, currentToken), gt(refresh_tokens.expiresAt, new Date()), isNull(refresh_tokens.revokedAt)));
    if (!result) { //if it fails to find a row with that uuid the query returns an empty array so results is undefined/falsy 
        throw new UnauthorizedError("Bad Token! Please log in");
    }
    return result;
}
export async function updateRefreshToken(userId, newToken) {
    await db
        .update(refresh_tokens)
        .set({
        token: newToken,
        updatedAt: new Date(),
    })
        .where(eq(refresh_tokens.userId, userId))
        .execute(); //added to stop hanginng
}
export async function revokeRefreshToken(currentToken) {
    await db
        .update(refresh_tokens)
        .set({
        updatedAt: new Date(),
        revokedAt: new Date()
    })
        .where(eq(refresh_tokens.token, currentToken))
        .execute(); //added to see if it stops hanging the request
}
