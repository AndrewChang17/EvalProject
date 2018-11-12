const router = require('express').Router();
//const sites = require('../db/mock/sites.json');

const query = "SELECT s.id, s.name, s.bounding, t.id AS tid FROM sites s, trees t WHERE s.id = t.site_id";

module.exports = (db) => {
  router.get('/', (request, response, next) => {
      db(query)
          .then(res => {
              response.json(formatSites(res));
          })
          .catch(err => console.log(err));
  });

  return router;
};

function formatSites(data) {
    let sites = {
        byId: {},
        ids: []
    };
    data.forEach(s => {
        if (!sites.byId[s.id])
        {
            sites.ids.push(s.id);
            sites.byId[s.id] = {
                id: s.id,
                name: s.name,
                bounding: s.bounding,
                trees: [],
            };
        }
        sites.byId[s.id].trees.push(s.tid);
    });

    return sites;
}