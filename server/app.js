var express = require('express');
var app = express();
global.__basedir = __dirname;
app.use(express.json());
require('./routes')(app);
require('./plugins/db')(app);

app.get('/', function (req, res) {
  res.send('Received client request');
});


app.listen(8081, function () {
  console.log('Server is running in http://localhost:8081!');
});

// const cors = require("cors");
// const express = require("express");
// const app = express();
// global.__basedir = __dirname;
// var corsOptions = {
//   origin: "http://localhost:8080"
// };
// app.use(cors(corsOptions));
// const initRoutes = require("./routes");
// require('./plugins/db')(app);
// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);
// let port = 8081;
// app.listen(port, () => {
//   console.log(`Running at localhost:${port}`);
// });