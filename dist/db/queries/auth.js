import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function hashRetrievel(userEmail) {
    console.log(`rereving db data for ${userEmail}`); //debug line
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail))
        .limit(1);
    return result;
}
