import * as argon2 from "argon2";
import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "./errors.js";
import { hashRetrievel } from "../db/queries/auth.js";
import { UserResponse } from "./create_user.js";

export function hashPassword(password: string): Promise<string> {
    return argon2.hash(password)
}

function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password)
}

export async function loginHandler(req: Request, res: Response) {
    const email = String(req.body?.email ?? "").trim();
    const password = req.body?.password;
   
    if (!password || !email) {
        throw new BadRequestError("Please provide an email and password")
    }
    const userData = await hashRetrievel(email)
   
    if (!userData) {
        throw new UnauthorizedError(" Login failed, please check your email and password")
    }
    const loginState = await checkPasswordHash(password, userData.hashedPassword) //returns a bool
   

    if(!loginState) { //booleans are truthy/falsy
        throw new UnauthorizedError(" Login failed") //wanted a diffrent message so if it fails here i can see it 
    }
     const response: UserResponse = {
    id: userData.id,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    email: userData.email,
  }

    return res.status(200).json(response);
}