import express from 'express'
const app = express()
const port = 3000
import cors from 'cors'
import { dbConnection } from './db/db.connection.js'
import { bootstrab } from './src/modules/index.routes.js'
import { config } from 'dotenv'
import { globalError } from './src/middleware/globalError.js'
config()
cors()
dbConnection()
app.use(express.json())
app.use('/uploads',express.static('uploads'))
bootstrab(app)

app.use(globalError)
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))