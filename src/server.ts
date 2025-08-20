import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import userRouter from './router/UserRouter'
import predictRouter from './router/PredictedModelRouter'
import path from 'path'
const app = express()
const PORT = process.env.PORT

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use("/static/avatar", express.static(path.join(process.cwd(), "uploads/avatar")));


// api
app.use('/api/user',userRouter)
app.use('/api/predict',predictRouter)

//server start
app.listen(PORT,()=>{
  console.log(`app listen on port 3000`)
})
