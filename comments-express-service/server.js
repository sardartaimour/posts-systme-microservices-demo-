const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = 3100;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPosts = {};

app.get('/posts/:postId/comments', (req, res) => {
    res.send(commentsByPosts[req.params.postId] || []);
});

app.post('/posts/:postId/comments', (req, res, next) => {
   
    try {
        const comments = commentsByPosts[req.params.postId] || [];
        const id = comments.length ? (parseInt(comments[comments.length-1].id) + 1).toString() : '1';
        const { comment } = req.body;
        const commentPayload = {
            id, comment, postId: req.params.postId, status: 'Pending'
        };
        comments.push(commentPayload);
    
        commentsByPosts[req.params.postId] = comments;

        // console.log('check this in comment service -> ',  commentPayload)
    
        axios.post('http://localhost:3300/events', {
            type: 'CommentCreated',
            data: commentPayload
        });
    
        res.status(201).send(comments);
    } catch(e) {
        next(e?.response);
    }
});

app.post('/events', async (req, res, next) => {

    try {
        const { type, data } = req.body;

        if (type === 'CommentModerated') {
            const { postId, id, status } = data;
            const comments = commentsByPosts[postId];
            const comment = comments.find(cmnt => cmnt.id === id);
            comment.status = status;

            await axios.post('http://localhost:3400/events', {
                type: 'CommentUpdated',
                data: comment
            });
        }

        res.send({ status: 'OK' });
    } catch(e) {
        next(req.body)
    }

});

app.listen(PORT, () => {
    console.log('COMMENTS server is listening on port: ', PORT)
});