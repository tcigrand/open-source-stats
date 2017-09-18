"use strict";

var knex = require('../knex');

const projects = () => {
    return knex()('Projects');
};

module.exports = {
    getAll: () => {
        return projects().where({}).orderBy('Id', 'asc');
    }
};
