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
