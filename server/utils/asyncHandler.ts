import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";

export type AsyncHandler = (
  handler: RequestHandler,
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler: AsyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (err) {
      next(err);
    }
  };
};

export { asyncHandler };
