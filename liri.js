require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdbApi = require('omdb-client');
var fs = require("fs");
var chalk = require("chalk");
var date = require("date-and-time");


// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var query   = process.argv[3];

console.clear();
//Validation for the command being entered by the user
(command != undefined) ? command = command.toLowerCase() : console.log(chalk.bgYellow('ERROR, PLEASE KILL YOURSELF'));

console.log(chalk.inverse('Ask LIRI any of the following: Tweets, Spotify, Movie, ToDo'));

//Validate for
(process.argv[4] != undefined) ? console.log(chalk.bgRed('ERROR, MULTI-WORDS HAVE TO BE SEPARATED BY DASH. ie: Home-alone')) : process.exit();