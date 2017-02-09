const express = require('express'),
      app = express(),
      mongo = require('mongodb').MongoClient,
      config = require('./config/connection'),
      port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.end('Hello World!');
});

mongo.connect(config.getDbConnectionString());

app.listen(port);