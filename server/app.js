const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const app = express()
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { checkUser } = require('./middleware/authMiddleware')
require('dotenv').config()

const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const server = http.createServer(app)

// setup-middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())


// socket.io configuration
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("join_room",(roomId) => {
    socket.join(roomId)
    console.log(`user with id: ${socket.id} joined room id: ${roomId}`)
  })
  
  socket.on("send_message", (Msgdata) => {
    socket.to(Msgdata.room).emit("recieve_message", Msgdata)
  })  

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id)
  })
})

// routes-middleware
app.get('*', checkUser)
app.use(userRoutes)
app.use(postRoutes)
app.use(commentRoutes)
app.use(messageRoutes)
app.use(cors())

const port = 8000

// database connection
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('mongoose connected')
    server.listen(port, () => {
      console.log(`Listening at port ${port}`);
    })
  }
  )
  .catch((err) => console.log(err));

