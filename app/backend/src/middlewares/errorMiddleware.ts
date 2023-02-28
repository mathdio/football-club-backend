import { Request, Response, NextFunction } from 'express';

export default class ErrorMiddleware {
  public static handle(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Response {
    const { name, message } = err;
    switch (name) {
      case 'UNAUTHORIZED':
        return res.status(401).json({ message });
      default:
        console.log(err);
        return res.status(500);
    }
  }
}
