const express=  require("express")
const cors = require("cors")
const listEndPoints = require("express-list-endpoints")
const usersRouter = require("./services/users")
const mongoose = require("mongoose")
const http = require("http")


const createSocketServer = require("./socket")

const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./errorHandlers")

  const server = express()
  const httpServer = http.createServer(server)
  createSocketServer(httpServer)

  server.use(cors())
  const port = process.env.port

  server.use(express.json())

  server.use("/users",usersRouter)

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndPoints(server))

mongoose
  .connect(process.env.MONGO_DB,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
      useCreateIndex:true, 

  })
  .then(
      httpServer.listen(port,()=>{
          console.log("Running on port",port)
      })
  )
  .catch(err=>console.log(err))