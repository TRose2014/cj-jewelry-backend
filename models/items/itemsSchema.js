'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const items = mongoose.Schema({
  name: {type: String, required: true },
  description: {type: String, required: true },
  price: {type: Number, required: true },
  
});

items.set('collection', 'jewelry');

module.exports = mongoose.model('items', items);