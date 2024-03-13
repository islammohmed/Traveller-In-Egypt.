import express from 'express'
const app = express()
const port = 3000
import cors from 'cors'
import { dbConnection } from './db/db.connection.js'
import { bootstrab } from './src/modules/index.routes.js'
import { config } from 'dotenv'
import { globalError } from './src/middleware/globalError.js'
import { AppError } from './src/utils/AppError.js'
import { reservePlace } from './src/modules/Book trip/controller/BookTrip.controller.js'
import { userModel } from './db/models/user.model.js'
config()
app.use(cors())
dbConnection()
app.post('/webhook', express.raw({ type: 'application/json' }), reservePlace)
app.use(express.json())
app.use('/uploads', express.static('uploads'))
bootstrab(app)
app.use('*', (req, res, next) => {
    next(new AppError('Wekcome to our Site , Url Not Founded', 404))
})
app.use(globalError)
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))


process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})