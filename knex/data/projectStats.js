"use strict";

var knex = require('../knex');

const projectStats = () => {
    return knex()('Project_Stats');
};

module.exports = {
    byProjectId: (projectId) => {
        return projectStats().where({ Project_Id: projectId });
    }
};
