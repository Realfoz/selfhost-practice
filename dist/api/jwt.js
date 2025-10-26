import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./errors.js";
export function makeJWT(userID, expiresIn, secret) {
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    let decoded; // unknown becasue it will end up as a union with a few options to narrow down after. This is like any before it knows its an any
    try {
        const decoded = jwt.verify(tokenString, secret);
    }
    catch {
        throw new UnauthorizedError("Auth expired, Please login to continue");
    }
    if (typeof decoded !== 'object' || decoded === null || !("sub" in decoded)) {
        throw new BadRequestError("Invalid token, if issues persist please contact the admin");
    }
    return decoded.sub; // O_o it defines the type of a property in an object as its constructed to the tsc...fucking witchcraft i tell ya
}
