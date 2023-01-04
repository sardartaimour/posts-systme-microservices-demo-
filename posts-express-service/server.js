const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = 3200;
const app = express();
app.use(bodyParser.json()); 
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res, next) => {

    try {
        const id = Object.keys(posts).length ? (parseInt(Object.keys(posts)[Object.keys(posts).length-1]) + 1).toString() : '1';
        const { title } = req.body;
    
        posts[id] = {
            id, title
        };
    
        await axios.post('http://localhost:3400/events', {
            type: 'PostCreated',
            data: {
                id, title
            }
        });
    
        res.status(201).send(posts[id]);
    } catch(e) {
        next(e);
    }
});

app.post('/events', (req, res) => {

    const event = req.body;
    res.send({ status: 'OK' });

});


app.listen(PORT, () => {
    console.log('POSTS server is listening on port: ', PORT)
});