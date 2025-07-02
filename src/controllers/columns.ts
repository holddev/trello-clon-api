import { NotFoundError } from "../errors/error";
import { Column, NewColumn } from "../models/columns";
import { ColumnRepository } from "../repositories/columns";
import { ControllerResponse } from "../types/types";
import { handleControllerError } from "../utils/utils";

export class ColumnController {
  constructor(private columnsRepository: ColumnRepository) { }

  async getAll(userId: string, boardId: number): Promise<ControllerResponse<Column[]>> {
    try {
      const result = await this.columnsRepository.getAll(userId, boardId);

      if (!result || result.length === 0) {
        throw new NotFoundError("No columns found for this board");
      }

      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error fetching columns:", error)
      const { message, status } = handleControllerError(error)
      return { ok: false, data: null, message, status };
    }

  }

  async create(userId: string, data: NewColumn): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.create(userId, data);
      return { ok: true, message: "Column created Successfully", data: result, status: 201 };
    } catch (error) {
      console.error("Error creating column:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async update(userId: string, columnId: number, data: Partial<Column>): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.updateField(userId, columnId, data);
      if (!result) {
        throw new NotFoundError("Column not found");
      }
      return { ok: true, message: "Board updated Successfully", data: result, status: 200 };
    } catch (error) {
      console.error("Error updating column:", error);
      const { message, status } = handleControllerError(error)
      return { ok: false, data: null, message, status };
    }
  }

  async delete(userId: string, columnId: number): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.delete(userId, columnId);

      if (!result) {
        throw new NotFoundError("Column not found");
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error deleting column:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }
}