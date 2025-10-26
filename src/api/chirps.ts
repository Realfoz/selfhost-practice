import { Request, Response } from "express";
import { getAllChirps, getChirp } from "../db/queries/chirp.js";
import { BadRequestError } from "./errors.js";
import { confirmToken } from "./auth.js";


export async function allChirpsHandler(req: Request, res: Response) {
    await confirmToken(req) //auth confirmation layer
    const results = await getAllChirps()

    if (!results) {
            throw new BadRequestError("Something went wrong! Chirp retrieval failed")
        }
    return res.status(200).json(results)
}

export async function getChirpHandler(req: Request, res: Response) {
    await confirmToken(req)
    const chirpID = req.params.chirpID
    if (!chirpID) {
        throw new BadRequestError(
            "Invalid Chirp ID"
        )}

    return res.status(200).json(await getChirp(chirpID))
}