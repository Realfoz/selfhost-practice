import { UnauthorizedError } from "../../api/errors.js";
import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
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
