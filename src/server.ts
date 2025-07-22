import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import userRouter from './router/UserRouter'
const app = express()
const PORT = process.env.PORT

// middlewares
app.use(express.json())
app.use(cookieParser())

// api
app.use('/api/user',userRouter)

//server start
app.listen(PORT,()=>{
  console.log(`app listen on port 3000`)
})
