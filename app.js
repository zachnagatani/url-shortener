const express = require('express'),
      app = express(),
      mongo = require('mongodb').MongoClient,
      dbURL = process.env.MONGOLAB_URI,
      url = require('url'),
      port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.end('URL SHORTENER');
});

// Handle shortened URL access
app.get('/:id', (req, res) => {
    mongo.connect(dbURL, (err, db) => {
        if (err) return console.log(err);

        // Find the right document
        db.collection('urls')
            .find({
                _id: parseInt(req.params.id)
            }).toArray((err, docs) => {
                // If not found, let 'em know!
                if (err) {
                    res.status(400);
                    res.end('That shortened URL doesn\'t point anywhere. Please check your URL (the part after the last "/") and try again.');
                    db.close();
                    return;
                }

                // Redirect to the original URL
                res.redirect(docs[0].original);
                res.end();
                db.close();
            });
    });
});

app.get('/shorten/*', (req, res) => {
    // Create a shortened URL if URL is passed in
    if (req.params[0].startsWith('http://') ||
        req.params[0].startsWith('https://')) {
            // Open db connection
            mongo.connect(dbURL, (err, db) => {
                if (err) return console.log(err);

                // Grab the counter and urls collections
                const counter = db.collection('counter'),
                    urls = db.collection('urls');

                // Find the counter
                counter.find({
                            _id: 'urlCounter'
                        })
                        .toArray((err, docs) => {
                            if (err) return console.log(err);

                            // Grab the count
                            const count = parseInt(docs[0].counter) + 1;

                            // Update the counter so we never have duplicates
                            // This comes first so if there is an error here, we don't insert the url
                            counter.update({
                                _id: 'urlCounter'
                            }, {
                                $set: {
                                    counter: count
                                }
                            }, err => {
                                if (err) return console.log(err);
                            });

                            // Object to insert into db
                            const urlData = {
                                _id: count,
                                original: req.params[0],
                                short: 'https://' + req.hostname + '/' + count
                            };

                            // Insert the url with unique id based on count
                            urls.insert(urlData, (err, data) => {
                                if (err) return console.log(err);
                                res.json(urlData);
                                db.close();
                            });
                        });
            });
        } else {
            res.status(400);
            res.end('Please enter a valid URL, starting with "http://" or "https://" to get your shortened URL. Thank you!');
        }
});

app.listen(port);