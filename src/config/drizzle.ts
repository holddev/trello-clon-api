import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

interface Config {
  DB_URL: string;
  DB_TOKEN: string;
}

export const createDbClient = (config: Config) => {
  const { DB_URL, DB_TOKEN } = config
  const client = createClient({ url: DB_URL, authToken: DB_TOKEN })

  return drizzle(client)
}