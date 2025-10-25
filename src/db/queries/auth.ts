import { db } from "../index.js";
import { users, User } from "../schema.js";
import { eq } from "drizzle-orm";


export async function hashRetrievel(userEmail: string): Promise<User | undefined>{
    
    const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, userEmail))
    .limit(1);
    return result;
}