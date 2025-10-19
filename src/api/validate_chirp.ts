import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";



export function validateChirpHandler(req: Request, res: Response) { // refactored to use the express json middleware so all responses use the .json() method.
      
            if (!req.body.body || typeof req.body.body !== "string") {
              throw new BadRequestError("Something went wrong, Invalid request body") //uses new err handler and classes
            }
            if (req.body.body.length > 140) {
              throw new BadRequestError("Chirp is too long. Max length is 140") //uses new err handler and classes
            }
            // "swear" filter layer
            const words: string[] = req.body.body.split(" ") // forces the array to be only of strings so TS is happy
            const censored = words.map(word => profanityFinder(word)) //maps each word to the profanity helper function      
            const cleanedBody = censored.join(" ") 
            res.status(200).json({cleanedBody}); //stringifys the JSON and puts it as the response with `ok` code 200
            return;
                
}

function profanityFinder(word: string): string {
  if (ProfanitySet.has(word.toLowerCase())) { // just checks if each word passed in is made lowercase and checks if its in the set, if it is it gets **** overwritten
    word = "****"
    return word;
  }
  return word;
}

const ProfanitySet = new Set([ // set so its scalable and i think its better on the big O stuff
  `kerfuffle`,
  `sharbert`,
  `fornax`
])