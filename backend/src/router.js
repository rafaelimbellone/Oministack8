const express = require("express");
const DevController = require("./controllers/DevController");
const LikesController = require("./controllers/LikeController");
const disLikesController = require("./controllers/disLikes");
const routes = express.Router();

routes.get('/dev', DevController.index);
routes.get('/', DevController.index2);
routes.post('/dev', DevController.store);
routes.post('/dev/:devId/likes', LikesController.store);
routes.post('/dev/:devId/dislikes', disLikesController.store);

module.exports = routes;