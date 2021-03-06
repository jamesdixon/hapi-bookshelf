'use strict';

var hoek = require('hoek');
var boom = require('boom');

exports.register = function (server, options, next) {
  options = hoek.applyToDefaults({
    noRow: 'No rows were affected in the update, did you mean to pass the {method: "insert"} option?'
  }, options);
  var bookshelf = options.bookshelf;
  if (!bookshelf) return next(new Error('Bookshelf instance must be passed as "bookshelf"'));
  server.ext('onPreResponse', function (request, reply) {
    if (request.response instanceof bookshelf.Model.NotFoundError) {
      return reply(boom.notFound());
    }
    else if (request.response.isBoom && request.response.message === options.noRow) {
      return reply(boom.notFound());
    }
    else {
      return reply.continue();
    }
  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
