'use strict';

const express = require('express');
const authRouter = express.Router();
const Role = require('./rolesModel');
const User = require('./usersModel');

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

authRouter.post('/auth/role', (req, res) => {

  let saves = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({role, capabilities: capabilities[role]});
    saves.push(newRecord.save());
  });
  Promise.all(saves);
  res.status(200).send('Roles created');
});

authRouter.post('/auth/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      console.log('signing up');
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.status(200).send(req.token);
    })
    .catch(next);
});

authRouter.get('/auth/signin', (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;