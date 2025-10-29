import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
export async function createUserHandler(req, res) {
    const userEmail = String(req.body?.email ?? "").trim(); //checks its a string with no spaces
    const userPwd = req.body?.password;
    if (!userEmail) {
        throw new BadRequestError("Invalid email");
    }
    if (!userPwd) {
        throw new BadRequestError("Invalid Password");
    }
    const hash = String(await hashPassword(userPwd));
    const user = await createUser({
        email: userEmail,
        hashedPassword: hash
    }); // puts it into a newUser object type that the functuion expects
    console.log("createUser result:", user); // log line
    if (!user || user.email !== userEmail) {
        return res.status(409).type("text/plain").send("Email already exists");
    }
    const response = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed
    };
    return res.status(201).json(response);
}
