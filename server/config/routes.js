var userController = require('../users/userController.js');
var gameController = require('../game/multiGameController');
var helpers = require('./helpers.js'); // our custom middleware

module.exports = function (app, express) {
  app.get('/api/users/profile', userController.getUser);
  app.get('/api/users/signedin', userController.checkAuth);

  app.post('/api/games', gameController.makeGame);

  // Route to obtain specified multiplayer game instance
  app.route('/api/games/:game_id')
  .get(function (req, res) {
    gameController.getGame(req.params.game_id, res);
  });

  // Route to create new multiplayer game instances
  app.route('api/games/:game_id')
  .post(function (req, res) {
    gameController.cancelGame(req.params.game_id, res);
  });

  // Route to update specified multiplayer game instance
  app.post('/api/games/update', gameController.updateGame);

  // Route to remove specified multiplayer game instance
  app.post('/api/games/remove', gameController.removeGame);

  // Route to sign in users
  app.post('/api/users/signin', userController.signin);

  // Route to sign up users
  app.post('/api/users/signup', userController.signup);

  // Route to signout users
  app.get('/api/users/signout', userController.signout);

  // Route to update user preferences and settings
  app.put('/api/users/profile', userController.updateUser);

  // Route to submit friend request
  app.post('/api/users/friendRequest', userController.submitFriendRequest);

  // Route to handle a friendRequestAction
  app.post('/api/users/handleFriendRequestAction', userController.handleFriendRequestAction);

  app.get('/api/users/handleGetFriends', userController.handleGetFriends);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
