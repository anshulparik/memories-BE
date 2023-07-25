import { HttpException } from "@nestjs/common";

export const throwCustomError = (error) => {
  const message =
    error?.response?.message || error?.message || 'Something went wrong';
  const statusCode = error?.response?.statusCode || 500;

  throw new HttpException(message, statusCode);
};
