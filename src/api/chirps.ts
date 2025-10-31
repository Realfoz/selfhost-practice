import { Request, Response } from "express";
import { chirpsByAuthorId, deleteChirp, getAllChirps, getAllChirpsDesc, getChirp } from "../db/queries/chirp.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { confirmToken } from "./auth.js";


export async function allChirpsHandler(req: Request, res: Response) {
    // dont need to auth here await confirmToken(req) //auth confirmation layer
    let results = []
    if (req.query.sort && req.query.sort === "desc") { //if they specify desc
        results = await getAllChirpsDesc()
    } else if (!req.query.sort || req.query.sort === "asc"){ //if they dont specify or specify asc
        results = await getAllChirps()
    } else {
        throw new BadRequestError("Invalid sort query") //removes all other failed querys
    }
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

export async function getAuthorsChirpsHandler(req: Request, res: Response){
    const authorId = req.query.authorId
    if(!authorId || typeof authorId !== "string"){
        throw new BadRequestError("Invalid Author ID")
    }
    const chirps = await chirpsByAuthorId(authorId)
    return res.status(200).json(chirps)
}