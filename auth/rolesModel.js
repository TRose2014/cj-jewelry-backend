'use strict';

const mongoose = require('mongoose');

const roles = new mongoose.Schema({
  role: {type: String, required: true},
  capabilities: {type: Array, required: true},
});

roles.set('collection', 'roles');

module.exports = mongoose.model('roles', roles);