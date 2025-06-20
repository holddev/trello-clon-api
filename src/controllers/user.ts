import { User } from "../models/users";
import { UserRepository } from "../repositories/user";
import { ControllerResponse } from "../types/types";

export class UserController {
  constructor(private repo: UserRepository) { }

  async create(data: User): Promise<ControllerResponse<User>> {
    try {
      const result = await this.repo.create(data)
      return ({
        ok: true,
        data: result,
        status: 201
      })
    } catch (error) {
      console.error("Algo salio mal: ", error)
      return ({
        ok: false,
        data: null,
        message: "Internal Server Error",
        status: 500
      })
    }
  }

  async findAll(): Promise<ControllerResponse<User[]>> {
    try {
      const result = await this.repo.findAll();
      return ({
        ok: true,
        data: result,
        status: 200
      })
    } catch (error) {
      console.error("Algo salio mal: ", error)
      return ({
        ok: false,
        data: null,
        message: "Internal Server Error",
        status: 500
      })
    }

  }

  async findById(id: string): Promise<ControllerResponse<User>> {
    try {
      const result = await this.repo.findById(id);
      if (!result) {
        return ({
          ok: false,
          data: null,
          message: "User not found",
          status: 404
        })
      }
      return ({
        ok: true,
        data: result,
        status: 200
      })

    } catch (error) {
      return ({
        ok: false,
        data: null,
        message: "Internal Server Error",
        status: 500
      })
    }
  }
}