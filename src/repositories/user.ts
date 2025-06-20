import { eq } from 'drizzle-orm'
import { User, users } from "../models/users";
import { LibSQLDatabase } from 'drizzle-orm/libsql';

export class UserRepository {
  constructor(private db: LibSQLDatabase) { }

  async create(data: User) {
    const result = await this.db.insert(users).values(data).returning()
    return result[0]
  }

  async findAll() {
    return await this.db.select().from(users)
  }

  async findById(id: string) {
    const result = await this.db.select().from(users).where(eq(users.id, id))

    return result[0];
  }
}