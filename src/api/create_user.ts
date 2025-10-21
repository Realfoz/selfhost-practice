import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";


export async function createUserHandler(req: Request, res: Response) {
    const email = String(req.body?.email ?? "").trim(); //checks its a string with no spaces
    if (!email) { 
              throw new BadRequestError("Invalid email") 
            }
    const user = await createUser({email}) // puts it into a newUser object type that the functuion expects
    console.log("createUser result:", user); // log line
    if (!user || user.email !== email) {
      return res.status(409).type("text/plain").send("Email already exists");
    }

    return res.status(201)
    .json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
