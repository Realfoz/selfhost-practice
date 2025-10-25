import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
import { User } from "src/db/schema.js";


export type UserResponse = Omit<User, "hashedPassword">; //makes sure we dont send back the hash accidently

export async function createUserHandler(req: Request, res: Response) {
  
    const userEmail =  String(req.body?.email ?? "").trim(); //checks its a string with no spaces
    const userPwd = req.body?.password
    if (!userEmail) { 
      throw new BadRequestError("Invalid email") 
    }
    if (!userPwd) {
      throw new BadRequestError("Invalid Passwordn")
    }
    const hash = String(await hashPassword(userPwd))
    const user = await createUser({
      email: userEmail,
      hashedPassword: hash
    }) // puts it into a newUser object type that the functuion expects
    console.log("createUser result:", user); // log line
    if (!user || user.email !== userEmail) {
      return res.status(409).type("text/plain").send("Email already exists");
    }

    const response: UserResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    //no hash here :)
  }
    return res.status(201).json(response);
}

