const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = 3500;
const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res, next) => {
   
    try {   
        const { type, data } = req.body;
        if (type === 'CommentCreated') {
            const status = data.comment.includes('orange') ? 'rejected' : 'approved';
            axios.post('http://localhost:3300/events', {
                type: 'CommentModerated',
                data : { ...data, status }
            });
        }
       
        res.status(201).send({});
    } catch(e) {
        next(e.response);
    }
});

app.listen(PORT, () => {
    console.log('Moderation service is listening on port: ', PORT)
});