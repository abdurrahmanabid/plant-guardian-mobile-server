import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
const app = express()


const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser())

app.listen(PORT,()=>{
  console.log(`app listen on port 3000`)
})
