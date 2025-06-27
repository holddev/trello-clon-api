import { Board, newBoard } from "../models/boards";
import { BoardRepository } from "../repositories/boards";
import { ControllerResponse } from "../types/types";

export class BoardController {
  constructor(private boardRepository: BoardRepository) { }

  async create(data: newBoard): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.create(data);
      return { ok: true, data: result, status: 201 };
    } catch (error) {
      console.error("Error creating board:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async findAll(userId: string): Promise<ControllerResponse<(Board)[]>> {
    try {
      const result = await this.boardRepository.findAll(userId);
      if (!result || result.length === 0) {
        return { ok: false, data: null, message: "No boards found", status: 404 };
      }

      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error fetching boards:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async updateField(userId: string, id: number, data: Partial<Board>): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.updateField(userId, id, data);
      if (!result) {
        return { ok: false, data: null, message: "Board not found", status: 404 };
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error updating board:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
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
      console.error("Error reordering boards:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async findByIdWithDetails(userId: string, id: number): Promise<ControllerResponse<Board | null>> {
    try {
      const result = await this.boardRepository.findByIdWithColumnsAndTasks(userId, id);
      if (!result) {
        return { ok: false, data: null, message: "Board not found", status: 404 };
      }
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error fetching board details:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async delete(userId: string, id: number): Promise<ControllerResponse<Board>> {
    try {
      const result = await this.boardRepository.delete(userId, id);
      if (!result) {
        return { ok: false, data: null, message: "Board not found", status: 404 };
      }
      return { ok: true, data: result, message: "Board deleted successfully", status: 200 };
    } catch (error) {
      console.error("Error deleting board:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

}