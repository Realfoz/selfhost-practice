import { getAllChirps, getChirp } from "../db/queries/chirp.js";
import { BadRequestError } from "./errors.js";
export async function allChirpsHandler(req, res) {
    const results = await getAllChirps();
    if (!results) {
        throw new BadRequestError("Something went wrong! Chirp retrieval failed");
    }
    return res.status(200).json(results);
}
export async function getChirpHandler(req, res) {
    const chirpID = req.params.chirpID;
    if (!chirpID) {
        throw new BadRequestError("Invalid Chirp ID");
    }
    return res.status(200).json(await getChirp(chirpID));
}
