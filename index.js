const express = require('express');
let path = require('path');
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let mongoUrlLocal = "mongodb://admin:password@nodejs-app-mongodb";
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let databaseName = "my-db";

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.get('/get-profile', function (req, res) {
    let response = {};
    // Connect to the db
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
        console.log('Connected to MongoDB', err, client);
        if (err) throw err;

        let db = client.db(databaseName);

        let myquery = { userid: 1 };

        db.collection("users").findOne(myquery, function (err, result) {
            if (err) throw err;
            response = result;
            client.close();

            // Send response
            res.send(response ? response : {});
        });
    });
});

app.post('/api/update-profile', (req, res) => {
    const userObj = req.body;
    MongoClient.connect('mongodb://admin:password@localhost:27017', mongoClientOptions, (err, client) => {
        if (err) throw err;
        const db = client.db(databaseName);
        userObj.userid = 1;

        const query = { userid: 1 };
        const newValues = { $set: userObj };

        db.collection('users').updateOne(query, newValues, (err, result) => {
            if (err) throw err;
            client.close();
            console.log('Profile updated successfully');
            res.send(userObj);

        });
    });
    // res.send('Profile updated successfully');

});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})
