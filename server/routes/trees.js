const router = require('express').Router();
//const trees = require('../db/mock/trees.json');

const types = [
    'CEDAR',
    'SPRUCE',
    'PINE',
    'FIR'
];

const query = "TABLE trees";

module.exports = (db) => {
    router.get('/', (request, response, next) => {
        db(query)
            .then(res => {
                response.json(formatTrees(res));
            })
            .catch(err => console.log(err));
    });

    return router;
};

function formatTrees(data) {
    let trees = {
        byId: {},
        ids: []
    };
    data.forEach(t => {
        trees.ids.push(t.id);
        trees.byId[t.id] = {
            id: t.id,
            lat: t.lat,
            long: t.long,
            height: t.height,
            site_id: t.site_id,
            type: types[t.tree_type_id - 1],
        };
    });
    return trees;
}