const router = require('express').Router();
//const projects = require('../db/mock/projects.json');

const query = "SELECT p.id, p.name, s.id AS sid FROM projects p, sites s WHERE p.id = s.project_id";

module.exports = (db) => {
  router.get('/', (request, response, next) => {
    //response.json(projects);
      db(query)
          .then(res => {
              response.json(FormatProjects(res));
          })
          .catch(err => console.log(err));
  });

  return router;
};

function FormatProjects(data) {
  let projects = {
      byId: {},
      ids: []
  };
    data.forEach(p => {
      if (!projects.byId[p.id])
      {
          projects.ids.push(p.id);
          projects.byId[p.id] = {
              id: p.id,
              name: p.name,
              sites: []
          };
      }
      projects.byId[p.id].sites.push(p.sid);
    });

    console.log(projects);
    return projects;
}
