const router = require('express').Router();
const sites = require('../db/mock/sites.json');

module.exports = (db) => {
  router.get('/', (request, response, next) => {
    //response.json(sites);
      db('TABLE sites')
          .then(res => {
              //console.log(res);
              response.json(res);
          })
          .catch(err => console.log(err));
  });

  return router;
}
