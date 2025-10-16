export function validateChirpHandler(req, res) {
    try {
        if (!req.body.body || typeof req.body.body !== "string") {
            res.status(400).json({ error: "Something went wrong" }); // checks type is a string after its parsed
            return; // return after each res is updated so we dont overwrite accidently
        }
        if (req.body.body.length > 140) {
            res.status(400).json({ error: "Chirp is too long" }); // sets the res status to 400 with the err msg as an object if over 140chars
            return;
        }
        res.status(200).json({ valid: true }); //stringifys the JSON and puts it as the response with `ok` code 200
        return;
    }
    catch {
        res.status(400).json({ error: "Something went wrong" }); // fail safe to catch uneexpected stuff and handle it gracefully
        return;
    }
}
