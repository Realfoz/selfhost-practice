import { Request, Response } from 'express';

export function handlerReadiness(req: Request, res: Response) { //why was this async???
     // the request is what was sent to us, the response is an object made by express ready to go and we can update it before sending it like below
    res.set('Content-Type', 'text/plain; charset=utf-8') // updates the header
    res.send(`OK`) // sets the body to a string saying OK which is intepreted as a code 200 AKA everything is working and good
    // how it inteprets ok as code 200 is magical witchcraft and a topic for later study
}