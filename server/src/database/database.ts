var Sequelize = require('sequelize');

const bdd = "";
const user = "";
const pass = "";
const myDialect = { host: 'localhost', dialect: 'postgres', operatorsAliases: false };

export const Connection = new Sequelize(
    bdd,
    user,
    pass,
    myDialect
);
