var Sequelize = require('sequelize');

const bdd = "PLI";
const user = "Franco";
const pass = "tictac";
const myDialect = { host: 'localhost', dialect: 'postgres', operatorsAliases: false };

export const Connection = new Sequelize(
    bdd,
    user,
    pass,
    myDialect
);
