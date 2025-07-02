import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { Context } from 'hono'

// Extiende el contexto de Hono
declare module 'hono' {
  interface ContextVariableMap {
    db: LibSQLDatabase
    userId: string
  }
}