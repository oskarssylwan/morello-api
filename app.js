'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));


// Routes
const itemRoutes = require('./routes/items');
app.use('/items', itemRoutes);



app.get('/', (req, res, next) => {
  res.json({color: 'blue', isAwesome: true});
});

// Port Setup
app.listen(3000, () => {
  console.log('Server running on port 3000');
})
