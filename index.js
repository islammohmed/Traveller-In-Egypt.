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
import { startChatServer } from './src/modules/chat/Socket.js'
config()
// modify cors
app.use(cors({allowedHeaders:"*",origin:'*',credentials:false,methods:'*'}))
dbConnection()
app.post('/webhook', express.raw({ type: 'application/json' }), reservePlace)
app.use(express.json())
app.use('/uploads', express.static('uploads'))
bootstrab(app)
app.use('*', (req, res, next) => {
    next(new AppError('Welcome to our Site , Url Not Founded', 404))
})
app.use(globalError)
export const server = app.listen((process.env.PORT || port),
    () => {
        console.log(`Example app listening on port ${port}!`);
        startChatServer();
    })

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})

