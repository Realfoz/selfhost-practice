import { Request, Response } from "express";
import { deleteChirp, getAllChirps, getChirp } from "../db/queries/chirp.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
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
  const chirpID = req.params.chirpID;
  if (!chirpID) {
    throw new BadRequestError("Invalid Chirp ID");
  }
  const chirp = await getChirp(chirpID); //refactored to check chirp is recieved back
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }
  res.status(200).json(chirp);
}

export async function deleteChirpHandler(req: Request, res: Response) {
    const userID = await confirmToken(req)
    const chirpID = req.params.chirpID
    if (!chirpID) {
        throw new BadRequestError(
            "Invalid Chirp ID"
        )}
    
    const chirp = await getChirp(chirpID) //checks the chirp exists and gets its uuid linked to it
    if (!chirp) {
        throw new NotFoundError(
            "Invalid Chirp ID"
        )}
    if (chirp.userId !== userID) {
        throw new ForbiddenError(
            "This is not your chirp, log in again to retry"
        )}
  
    await deleteChirp(chirpID, userID)
    
    res.status(204).send()
}