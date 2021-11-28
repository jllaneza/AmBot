const express = require("express");
const server = express();

server.all("/", (_, res) => {
  res.send("AmBot is running!")
})

function keepAlive() {
  server.listen(process.env.PORT || 3000, () => {
    console.log("Server is ready!")
  });
}

module.exports = keepAlive;