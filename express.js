var express = require('express');
var path = require('path');
var PORT=8080;
var app = express();
app.use(express.static(path.join(__dirname, 'dist')));
console.log(`Port: ${PORT}`);
app.listen(PORT);