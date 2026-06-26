import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import upload from './routes/upload'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:1420', 'tauri://localhost'],
}))

app.get('/', (c) => c.json({ status: 'MCloud API running' }))
app.route('/upload', upload)

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('MCloud API running on http://localhost:3000')
})