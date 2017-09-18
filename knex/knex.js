const environment = process.env.KNEX_ENV || process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];

var connection = null;

const initialize = () => {
    if (connection === null) {
        connection = require('knex')(config);
    }
    return connection;
};

module.exports = initialize;
