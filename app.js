require('dotenv').config();
const config = require('./config.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = require('express')();
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');


// Middleware
app.use(bodyParser.json({limit: config.payload_limit}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

// Database Setup
const mongoose = require('mongoose');
mongoose.connect(config.db_location, {useMongoClient: true});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('DB connection error:', err);
});

mongoose.Promise = global.Promise;

// Routes
app.use('/api', require('./api').router);
const {schema} = require('./graphql')
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}));
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Error handler
// eslint-disable-next-line
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    message: error.message
  });
});

// Port Setup
app.listen(config.port, () => {
  console.log('Server running on port', config.port);
});
