import { Request, Response } from "express";
import { confirmToken, getBearerToken, hashPassword } from "./auth.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getUserData, updateUserEmailPwd  } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { UserResponse } from "./create_user.js";


export async function userCredsUpdateHandler(req: Request, res: Response){
    try{
    const uuid = await confirmToken(req)
    const userEmailNew =  String(req.body?.email ?? "").trim(); //checks its a string with no spaces
    const userPwdNew = req.body?.password
    const userData = await getUserData(uuid) //comes in as User type
    if (!userData.email || !userData.hashedPassword) {
        throw new UnauthorizedError(
            "Invalid UserData, Please Login again to continue"
        )
    }
    if (userEmailNew) { 
          userData.email = userEmailNew
        }
    if (userPwdNew) {
        let hashedPwd = await hashPassword(userPwdNew)
        userData.hashedPassword = hashedPwd         
        }
    await updateUserEmailPwd(userData)
    const safeUserData: UserResponse = { //forces the omitted hash type
        id: userData.id,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        email: userData.email,
        }
    res.status(200).json(safeUserData)
} catch {
    throw new UnauthorizedError(
        "Please log in andd try again"
    )
}} 

