'use strict';

const express = require('express');

const modelFinder = require('../middleware/modelFinder');

const v1Router = express.Router();

v1Router.param('model', modelFinder);

v1Router.get('/api/v1/:model', handleGetAll);
v1Router.get('/api/v1/:model/:id', handleGetOne);
v1Router.post('/api/v1/:model', handlePost);
v1Router.put('/api/v1/:model/:id', handlePut);
v1Router.delete('/api/v1/:model/:id', handleDelete);

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @description gets all the items from mongodb when /api/v1/:model is hit
 */

function handleGetAll(req, res, next) {
  req.model.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      res.status(200).json(output);
    })
    .catch(next);
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @description gets specific item from mongodb
 */

function handleGetOne(req, res, next) {
  req.model.get(req.params.id)
    .then( result => res.status(200).json(result[0]))
    .catch(next);
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @description adds an item to db
 */

function handlePost(req, res, next) {
  req.model.post(req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @description updates an item in db
 */

function handlePut(req, res, next) {
  req.model.put(req.params.id, req.body)
    .then( result => res.status(200).json(result))
    .catch(next);
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @description deletes an item in db
 */

function handleDelete(req, res, next) {
  req.model.delete(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
}

module.exports = v1Router;
