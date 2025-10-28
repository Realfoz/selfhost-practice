import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users, User } from "../schema.js";
import { UserResponse } from "../../api/create_user.js";



export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserData(uuid: string){
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, uuid))
  return result as User;
}

export async function updateUserEmailPwd(user: User){
    await db
    .update(users)
    .set({
      email: user.email,
      hashedPassword: user.hashedPassword
    })
    .where(eq(users.id, user.id))
}

