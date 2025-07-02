import { Board, newBoard } from "../models/boards";
import { BoardRepository } from "../repositories/boards";
import { ControllerResponse } from "../types/types";
import { handleControllerError } from "../utils/utils";
import { NotFoundError } from "../errors/error";

export class BoardController {
  constructor(private boardRepository: BoardRepository) { }

  async create(data: newBoard): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.create(data);
      return { ok: true, data: result, status: 201 };
    } catch (error) {
      console.error("Error creating board:", error);
      const { status, message } = handleControllerError(error)
      return { ok: false, data: null, message, status };
    }
  }

  async findAll(userId: string): Promise<ControllerResponse<(Board)[]>> {
    try {
      const result = await this.boardRepository.findAll(userId);
      if (!result || result.length === 0) {
        throw new NotFoundError("No boards found")
      }

      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error fetching boards:", error);
      const { status, message } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async updateField(userId: string, id: number, data: Partial<Board>): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.updateField(userId, id, data);
      if (!result) {
        throw new NotFoundError("Board not found")
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error updating board:", error);
      const { status, message } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async reorder(userId: string, data: Partial<Board>[]): Promise<ControllerResponse<null>> {
    try {
      const results = await Promise.all(data.map(async (board) => {
        if (!board.id) return board
        return this.boardRepository.updateField(userId, board.id, { order: board.order });
      }));

      return { ok: true, data: null, message: "Boards reordered successfully", status: 200 };
    } catch (error) {
      const { status, message } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async findByIdWithDetails(userId: string, id: number): Promise<ControllerResponse<Board | null>> {
    try {
      const result = await this.boardRepository.findByIdWithColumnsAndTasks(userId, id);
      if (!result) {
        throw new NotFoundError("Board not Found")
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async delete(userId: string, id: number): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.delete(userId, id);
      if (!result) {
        throw new NotFoundError("Board not found")
      }
      return { ok: true, data: result, message: "Board deleted successfully", status: 200 };
    } catch (error) {
      console.error("Error deleting board:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

}