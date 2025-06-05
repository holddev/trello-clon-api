import { eq } from 'drizzle-orm'
import { users } from "../models/schemas";
import { LibSQLDatabase } from 'drizzle-orm/libsql';

export class UserRepository {
  constructor(private db: LibSQLDatabase) { }

  async findAll() {
    return await this.db.select().from(users)
  }

  async findById(id: number) {
    return await this.db.select().from(users).where(eq(users.id, id))
  }
}