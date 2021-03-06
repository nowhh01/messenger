#!/usr/bin/env node

/* Sets up the environment variables from your .env file*/
require("dotenv").config();

/**
 * Module dependencies.
 */

const { app, sessionStore } = require("../app");
const http = require("http");
const db = require("../db");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces, and sync database.
 */

const io = require("socket.io")(server);
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("invalid user"));
      }
      User.findOne({
        where: { id: decoded.id }
      }).then((user) => {
        socket.userId = user.id;
        return next();
      });
    });
  } else {
    next(new Error("invalid user"));
  }
});

io.on("connection", (socket) => {
  console.log("socket connected");

  const userId = socket.userId;

  // add to room
  socket.join(userId);
  socket.broadcast.emit("add-online-user", userId);

  socket.on("disconnecting", () => {
    const userId = socket.userId;
    socket.broadcast.emit("remove-offline-user", userId);
  });

  socket.on("updated-messages", (messages) => {
    socket.broadcast.emit("updated-messages", messages);
  });
});

sessionStore
  .sync()
  .then(() => db.sync())
  .then(() => {
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);
}

exports.io = io;
