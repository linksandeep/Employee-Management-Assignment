import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<SuccessResponse<T>> => {
  const response: SuccessResponse<T> = {
    success: true,
    message
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};
