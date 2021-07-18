require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
const path = require('path');
const routes = require('./routes/index');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs'); //ejs

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/records', require('./records/records.controller'));

// routes
app.use('/', routes);


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port http://localhost:' + port));