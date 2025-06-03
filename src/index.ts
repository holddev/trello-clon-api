import { Hono } from 'hono'
import { env } from 'hono/adapter'

const app = new Hono()

app.get('/env', (c) => {
	console.log('el nombre: ', c.env)
	const { NAME } = env<{ NAME: string }>(c)
	return c.text('el nombre es: ' + NAME)
})

export default app
