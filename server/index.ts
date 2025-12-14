import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes/routes.ts'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000
const url = 'http://localhost'
const frontendPort = 5173
const fullUrl = `${url}${frontendPort ? `:${frontendPort}` : ''}`

app.use(
  cors({
    origin: fullUrl,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
