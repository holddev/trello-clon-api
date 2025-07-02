import { NotFoundError } from "../errors/error";
import { User } from "../models/users";
import { UserRepository } from "../repositories/user";
import { ControllerResponse } from "../types/types";
import { handleControllerError } from "../utils/utils";

export class UserController {
  constructor(private repo: UserRepository) { }

  async create(data: User): Promise<ControllerResponse<User>> {
    try {
      const result = await this.repo.create(data)
      return ({
        ok: true,
        message: "User created successfully",
        data: result,
        status: 201
      })
    } catch (error) {
      console.error("Error creating user: ", error)
      const { message, status } = handleControllerError(error)
      return ({ ok: false, data: null, message, status })
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
      console.error("Error fetching users: ", error)
      const { message, status } = handleControllerError(error)
      return ({ ok: false, data: null, message, status })
    }
  }

  async findById(id: string): Promise<ControllerResponse<User>> {
    try {
      const result = await this.repo.findById(id);
      if (!result) {
        throw new NotFoundError("User not found");
      }
      return ({ ok: true, data: result, status: 200 })

    } catch (error) {
      console.error("Error fetching user by ID: ", error)
      const { message, status } = handleControllerError(error)
      return ({ ok: false, data: null, message, status })
    }
  }

}