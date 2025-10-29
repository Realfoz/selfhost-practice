import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users, User } from "../schema.js";


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
      hashedPassword: user.hashedPassword,
      isChirpyRed: user.isChirpyRed
    })
    .where(eq(users.id, user.id))
}

export async function upgradeChirpyRed(userID: string) { //just need to make sure we dont pass the hash/email/other shit around
      await db
    .update(users)
    .set({
      isChirpyRed: true
    })
    .where(eq(users.id, userID))
}


