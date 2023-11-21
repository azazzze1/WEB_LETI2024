const express = require("express");
const server = express();

const cors = require('cors');

const corsOptions = {
'credentials': true,
'origin': true,
'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept'};

server.use(cors(corsOptions));

const routes = require("./routes");

server.use('/public', express.static('public'));

server.set("view engine", "pug");
server.set("views", `views`);

server.use('/', routes);
server.listen(3000);