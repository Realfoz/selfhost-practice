import { NextFunction, Request, Response } from "express"

class AppError extends Error {
    constructor(public readonly status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
}
}

export class BadRequestError extends AppError {
    constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}


export function middlewareErrorHandler(err: Error,req: Request,res: Response, next: NextFunction) {
    if (err instanceof AppError) { // checks if its one of the base classes to catch
        console.error(`Error: ${err.status} ${err.message}`);
        res.status(err.status).json({error: err.message})
        return;// ends things early on error
    }
    console.error("Something went wrong on our end"); //old faithful, the default
    res.status(500).json({ 
    error: "Something went wrong on our end",
  });
  return;
}