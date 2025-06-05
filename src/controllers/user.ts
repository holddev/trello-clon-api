import { UserRepository } from "../repositories/user";

export class UserController {
  constructor(private repo: UserRepository) { }

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: number) {
    return await this.repo.findById(id);
  }

}