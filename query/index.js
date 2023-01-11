const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const PORT = 3400;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", async (req, res, next) => {
  try {
    res.send(posts);
  } catch (e) {
    next(e);
  }
});

app.post("/events", async (req, res, next) => {
  try {
    const { type, data } = req.body;
    handleEvent(type, data);

    res.send({ status: "Ok" });
  } catch (e) {
    next(e);
  }
});

const handleEvent = (type, data) => {
  const id = data && data.id ? data.id : null;
  const comment = data && data.comment ? data.comment : "";
  const postId = data && data.postId ? data.postId : null;
  const status = data && data.status ? data.status : "Pending";
  const title = data && data.title ? data.title : "";

  switch (type) {
    case "PostCreated":
      posts[id] = {
        id,
        title,
        comments: [],
      };
      break;
    case "CommentCreated":
      const post = posts[postId];
      post.comments.push({ id, comment, postId, status });
      break;
    case "CommentUpdated":
      const _post = posts[postId];
      const _comment = _post.comments.find((com) => com.id === id);
      _comment.comment = comment;
      _comment.status = status;
      break;
    default:
      break;
  }
};

app.listen(PORT, async () => {
  console.log("Query service is listening on port: ", PORT);

  const res = await axios.get('http://localhost:3300/events');

  for (let event of res.data) {
    handleEvent(event.type, event.data);
  }
});
