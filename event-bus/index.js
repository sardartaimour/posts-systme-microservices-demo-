const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = 3300;
const app = express();
app.use(bodyParser.json());

const events = [];
app.post('/events', async (req, res, next) => {

    try {
        const event = req.body;
        events.push(event);

        await axios.post('http://localhost:3100/events', event); // comment service
        await axios.post('http://localhost:3200/events', event); // post service
        await axios.post('http://localhost:3400/events', event); // query service
        await axios.post('http://localhost:3500/events', event); // moderation service

        res.send({ status: 'Ok' });
    } catch(e) {
        next(e);
    }

});

app.get('/events', (req, res) => {
    res.status(200).send(events);
})

app.listen(PORT, () => {
    console.log('Event Bus is listening on port: ', PORT)
});