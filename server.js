const express = require("express")
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")
const ACTIONS = require("./socket_sever/action")

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
  },
})

// Static file serve
app.use(express.static("build"))

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

const userSocketMap = {}

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      }
    }
  )
}

const isUserExists = (username) => {
  return Object.values(userSocketMap).includes(username)
}

const onConnection = (socket) => {
  // User Join
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    if (!isUserExists(username) && username) {
      userSocketMap[socket.id] = username
      socket.join(roomId)
    }

    const clients = getAllConnectedClients(roomId)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      })
    })
  })

  // Code Change
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    })
  })

  // Sync Change
  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
  })

  // User Disconnecting
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms]

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      })
    })

    delete userSocketMap[socket.id]
    socket.leave()
  })
}

io.on("connection", onConnection)

httpServer.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
})
