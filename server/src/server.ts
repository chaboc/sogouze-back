import * as routesUsers from './controller/user.controller';
import * as routesSpotify from './controller/spotify.controller';

// Basic Setup
var Http = require('http');
var Express = require('express');
var Parser = require('body-parser');

// Setup express
let app = Express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    next();
});

app.use(Parser.json());
app.use(Parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);


// Set default route
app.get('/', function (req, res) {
    res.send({'mesage': "Welcome"});
});

app.use('/user', routesUsers);
app.use('/spotify', routesSpotify);

// Create server
Http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});