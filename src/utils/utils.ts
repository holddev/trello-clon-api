
import { AppError } from "../errors/error";
import { Status } from "../types/types";

export function handleControllerError(error: unknown): { status: Status; message: string } {
  if (error instanceof AppError) {
    return { status: error.statusCode, message: error.message };
  }

  return { status: 500, message: "Internal Server Error" };
}
