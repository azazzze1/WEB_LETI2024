const express = require("express")
const server = express()

const routes = require("./routes")

server.use('/public', express.static('public'));

server.set("view engine", "html");
server.set("views", `./views`);

server.use('/', routes)
server.listen(3000)
