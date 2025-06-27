import { Column, NewColumn } from "../models/columns";
import { ColumnRepository } from "../repositories/columns";
import { ControllerResponse } from "../types/types";

export class ColumnController {
  constructor(private columnsRepository: ColumnRepository) { }

  async getAll(userId: string, boardId: number): Promise<ControllerResponse<Column[]>> {
    try {
      const result = await this.columnsRepository.getAll(userId, boardId);
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error fetching columns:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }

  }

  async create(userId: string, data: NewColumn): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.create(userId, data);
      return { ok: true, data: result, status: 201 };
    } catch (error) {
      console.error("Error creating column:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async update(userId: string, columnId: number, data: Partial<Column>): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.updateField(userId, columnId, data);
      if (!result) {
        return { ok: false, data: null, message: "Column not found", status: 404 };
      }
      return { ok: true, data: result, status: 200 };

    } catch (error) {
      console.error("Error updating column:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async delete(userId: string, columnId: number): Promise<ControllerResponse<Column>> {
    try {
      const result = await this.columnsRepository.delete(userId, columnId);

      if (!result) {
        return { ok: false, data: null, message: "Column not found", status: 404 };
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error deleting column:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }
}