const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.get('/api/profile', (req, res) => {
    // Mock user profile data
    MongoClient.connect('mongodb://admin:password@localhost:27017', (err, client) => {
        if (err) throw err;
        const db = client.db('user-account');
        const query = { userid: 1 };
        db.collection('users').findOne(query, (err, result) => {
            if (err) throw err;
            client.close();
            res.send(result);
        });
    });
    // const userProfile = {
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget dignissim urna.'
    // };
    // res.json(userProfile);
});

app.post('/api/update-profile', (req, res) => {
    const userObj = req.body;
    MongoClient.connect('mongodb://admin:password@localhost:27017', (err, client) => {
        if (err) throw err;
        const db = client.db('user-account');
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
