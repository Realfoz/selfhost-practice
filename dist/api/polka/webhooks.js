import { config } from "../../config.js";
import { upgradeChirpyRed } from "../../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "../errors.js";
export async function updateChirpyRedHandler(req, res) {
    const APIKey = await getAPIKey(req);
    if (!APIKey || APIKey !== config.api.PolkaKey) {
        throw new UnauthorizedError("Invalid API Key, Please contact the admin");
    }
    const event = req.body?.event;
    const UUID = req.body?.data?.userId;
    if (!event || event !== "user.upgraded") {
        return res.status(204).send(); //if its not the event we want throw it out, 2xx codes stop it retrying
    }
    if (!UUID) {
        throw new NotFoundError("Invalid User");
    }
    try {
        await upgradeChirpyRed(UUID);
    }
    catch {
        throw new NotFoundError("Invalid User ID");
    }
    res.status(204).send();
}
