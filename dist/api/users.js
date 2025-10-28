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
        };
        res.status(200).json(safeUserData);
    }
    catch {
        throw new UnauthorizedError("Please log in andd try again");
    }
}
// status for tommorrow: i biffed it i think
// we are getting garbled packets back, i believe this was usualy a problem in something async but im to t ired to find it
// flow goes index >  handler(here) > gets uuid from token > checks new shit > gets user object frrom uuid >
// updates the object > sends that to db > makes new object omitting hash > sends it back
// try/catch entire functions like this handler above
