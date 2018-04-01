require("dotenv").config();

var keys = require('./keys.js');

// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var query   = process.argv[3];

