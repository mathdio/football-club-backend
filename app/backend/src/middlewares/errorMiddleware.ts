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
      case 'NOT_FOUND':
        return res.status(404).json({ message });
      case 'UNPROCESSABLE_CONTENT':
        return res.status(422).json({ message });
      default:
        console.log(err);
        return res.status(500);
    }
  }
}
