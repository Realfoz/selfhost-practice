import { Config } from "../config.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        const code = res.statusCode; // if it finds a finished it would run a function but we have nothing here but go on to define what it does with the fat arrow
        if (code >= 300) { // if its a non-ok code its logged to the console
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`); // this whole thing is basicly just waiting for things to be done so it can check its not borked and if it to log it but its about setting the timings using the stream so you dont check before its ready
        }
    });
    next(); // calls the next midddleware in the chain if it exists
}
export function middlewareMetricsInc(req, res, next) {
    res.on("finish", () => {
        Config.fileserverHits++;
    });
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    console.error("Something went wrong on our end");
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}
