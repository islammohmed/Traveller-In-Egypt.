import express from 'express'
const app = express()
const port = 3000
import cors from 'cors'
import { dbConnection } from './db/db.connection.js'
import { bootstrab } from './src/modules/index.routes.js'
import { config } from 'dotenv'
import { globalError } from './src/middleware/globalError.js'
import { AppError } from './src/utils/AppError.js'
config()
cors()
dbConnection()
app.use(express.json())
app.use('/uploads',express.static('uploads'))
bootstrab(app)
app.use('/',(req,res,next)=>{
    res.send('welcome to our project')
})
app.use('*',(req,res,next)=>{
    next(new AppError('Url Not Founded',404))
})
app.use(globalError)
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))


process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})