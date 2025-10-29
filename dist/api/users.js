import { confirmToken, hashPassword } from "./auth.js";
import { UnauthorizedError } from "./errors.js";
import { getUserData, updateUserEmailPwd } from "../db/queries/users.js";
export async function userCredsUpdateHandler(req, res) {
    try {
        const uuid = await confirmToken(req);
        const userEmailNew = String(req.body?.email ?? "").trim(); //checks its a string with no spaces
        const userPwdNew = req.body?.password;
        const userData = await getUserData(uuid); //comes in as User type
        if (!userData.email || !userData.hashedPassword) {
            throw new UnauthorizedError("Invalid UserData, Please Login again to continue");
        }
        if (userEmailNew) {
            userData.email = userEmailNew;
        }
        if (userPwdNew) {
            let hashedPwd = await hashPassword(userPwdNew);
            userData.hashedPassword = hashedPwd;
        }
        await updateUserEmailPwd(userData);
        const safeUserData = {
            id: userData.id,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            email: userData.email,
            isChirpyRed: userData.isChirpyRed
        };
        res.status(200).json(safeUserData);
    }
    catch {
        throw new UnauthorizedError("Please log in andd try again");
    }
}
