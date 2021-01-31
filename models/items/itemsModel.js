'use strict';

const Model = require('../mongoModel');
const schema = require('./itemsSchema');

class Items extends Model {}

module.exports = new Items(schema);
