import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { Env } from './types/types'
import { createDbClient } from './config/drizzle'
import { userRouter } from './routers/user'
import { boardRouter } from './routers/board'

const app = new Hono()


app.use('*', async (c, next) => {
	const config = env<Env>(c, 'workerd')

	try {
		const db = createDbClient({
			DB_URL: config.DB_URL,
			DB_TOKEN: config.DB_TOKEN,
		})
		c.set('db', db)
		await next()
	} catch (error: any) {
		console.log(error)
		return c.json({ error: "Unable to connect to the database" }, 500)
	}
})

app.get('/test', async (c) => {
	const db = c.get('db')
	try {
		const result = await db.run('SELECT 1 AS value')
		return c.json(result.rows)
	} catch (error: any) {
		console.log(error)
		return c.json({ error: "Failed to execute SQL query" }, 500)
	}
})

app.route('/users', userRouter())
app.route('/boards', boardRouter())

export default app
