import * as argon2 from "argon2";
import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "./errors.js";
import { addRefreshToken, checkUUID, getUserFromRefreshToken, hashRetrievel, revokeRefreshToken, updateRefreshToken } from "../db/queries/auth.js";
import { UserResponse } from "./create_user.js";
import { config } from "../config.js"
import { makeJWT, validateJWT } from "./jwt.js";
import { randomBytes } from "node:crypto";

export type UserWithToken = UserResponse & {
  token: string;
  refreshToken: string;
};

 export function getBearerToken(req: Request): string {
    if (!req.headers.authorization) {
        throw new UnauthorizedError("Invalid Token, Please log in to continue")
    }
    const tokenString = req.headers.authorization //comes in as an auth header
    const parts = tokenString.trim().split(" ") // incoming message is "Bearer <token_string>"
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer" ) { //once split we check the string is not broken and the beaere haas been removed fully
        throw new BadRequestError("Invalid Token, If problem persist please contact admin")
    }
    return parts[1] //returns only the token string
}

export function hashPassword(password: string): Promise<string> {
    return argon2.hash(password)
}

export function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password)
}

export async function loginHandler(req: Request, res: Response) {
    const email = String(req.body?.email ?? "").trim();
    const password = req.body?.password;
    const timer = 3600 //defaults tiemr to 1 hour always now
    const refreshToken = makeRefreshToken()
   
    if (!password || !email)  {
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
     const response: UserWithToken = {
    id: userData.id,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    email: userData.email,
    token: makeJWT(userData.id, timer, config.api.jwt),
    refreshToken: refreshToken
  }
    addRefreshToken(response) //sends to db to add token
    return res.status(200).json(response); //sends back to user
}

export async function confirmToken(req: Request){
    const userID = validateJWT(getBearerToken(req), config.api.jwt);
    // gives us back a connfirmed User with a valid time jwt  
    await checkUUID(userID)
    return userID
} //passes uuid back for handlers

function makeRefreshToken() {
    const token = randomBytes(32).toString('hex') //creates a random string 32 bytes long and then converts it to a 64 character hex string
    return token;
}

export async function refreshTokenHandler(req: Request, res: Response) {
    const currentToken = getBearerToken(req)
    const userData = await getUserFromRefreshToken(currentToken)
    const newToken = makeRefreshToken();
    await updateRefreshToken(userData.userId, newToken)
    const jwt = makeJWT(userData.userId, 3600, config.api.jwt)
    return res.status(200).json({token:jwt})
}

export async function revokeTokenHandler(req: Request, res: Response) {
    const currentToken = getBearerToken(req) //retrieves the current token
    await revokeRefreshToken(currentToken) // sets revoke date and update date to now
    return res.status(204).send() // successful response with no body, needs send or it hangs waiting for data
}

