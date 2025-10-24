import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function hashRetrievel(userID: string) {
    const [result] = await db
    .select({hashedPassword: users.hashedPassword})
    .from(users)
    .where(eq(users.id, userID))

    return result.hashedPassword;
}