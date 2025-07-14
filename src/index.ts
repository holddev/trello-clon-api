import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { Env } from './types/types'
import { createDbClient } from './config/drizzle'
import { userRouter } from './routers/user'
import { boardRouter } from './routers/board'
import { columnRouter } from './routers/columns'
import { TaskRouter } from './routers/tasks'
import { authenticateUser } from './middlewares/authenticateUser'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
	origin: ['http://localhost:5173', 'https://trello-clon.deno.dev/'],
	allowHeaders: ['Content-Type', 'Authorization'],
	allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
	exposeHeaders: ['Content-Length'],
	maxAge: 300,
	credentials: true,
}))


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

app.use('/priv/*', authenticateUser)

app.route('/users', userRouter())
app.route('/priv/boards', boardRouter())
app.route('/priv/columns', columnRouter())
app.route('/priv/tasks', TaskRouter())

export default app
