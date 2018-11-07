const router = require('express').Router();
const trees = require('../db/mock/trees.json');

module.exports = (db) => {
  router.get('/', (request, response, next) => {
    //response.json(trees);
      db('TABLE trees')
          .then(res => {
              //console.log(res);
              response.json(res);
          })
          .catch(err => console.log(err));
  });

  return router;
}
