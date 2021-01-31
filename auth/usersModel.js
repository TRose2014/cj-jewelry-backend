'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('./rolesModel');

const SINGLE_USE_TOKENS = process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;
const SECRET = process.env.SECRET;

const usedTokens = new Set();
const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};
const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, default: 'user', enum: ['admin', 'editor', 'user']},
}, {toObject: {virtuals: true}, toJson: {virtuals: true}});

users.virtual('acl', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne: true,
});

users.pre('findOne', function() {
  try {
    this.populate('acl');
  }
  catch(e) {
    console.error('error', e);
  }
});

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(err => {throw new Error(err);});
});

users.statics.authenticateToken = function(token) {
  
  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { console.log('rejecteds'); throw new Error('Invalid Token'); }
};

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.methods.generateToken = function(type) {
  let token = {
    username: this.username,
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || this.role || 'user',
  };
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  console.log(token.username);
  return jwt.sign(token, SECRET, options);
};

users.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

users.methods.generateKey = function() {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);
