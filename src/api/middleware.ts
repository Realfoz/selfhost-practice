import { NextFunction, Request, Response } from "express"
import { Config } from "../config.js"

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) { // middleware type input
  res.on("finish", () => { // when the streaam gets a new finished signal it passes that signal here to say "hey this is finished"
    const code = res.statusCode; // if it finds a finished it would run a function but we have nothing here but go on to define what it does with the fat arrow
    if (code >= 300) { // if its a non-ok code its logged to the console
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`); // this whole thing is basicly just waiting for things to be done so it can check its not borked and if it to log it but its about setting the timings using the stream so you dont check before its ready
    }
  });
  next(); // calls the next midddleware in the chain if it exists
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    Config.fileserverHits ++
  });
  next();
}

