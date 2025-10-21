import { ForbiddenError } from "./errors.js";
import { users } from "../db/schema.js";
export async function handleAdminReset(req, res, cfg, db) {
    console.log("RESET hit, platform=", cfg.api.platform);
    const platform = cfg.api.platform;
    if (platform !== `dev`) {
        throw new ForbiddenError(`End Point Forbidden`);
    }
    const before = await db.select().from(users);
    await db.delete(users);
    const after = await db.select().from(users);
    console.log("Users before/after:", before.length, after.length);
    return res.status(200).type("text/plain").send("OK");
}
;
