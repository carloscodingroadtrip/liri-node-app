require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdbApi = require('omdb-client');
var fs = require("fs");
var chalk = require("chalk");
var date = require("date-and-time");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var now = new Date();
var timeNow = date.format(now, 'MM/DD/YYYY HH:mm:ss');

var command = process.argv[2];
var query   = process.argv[3];

console.clear();
//Validation for the command being entered by the user
if (command != undefined) {
     command = command.toLowerCase();
}

console.log(chalk.inverse('Ask LIRI any of the following: Tweets, Spotify, Movie, ToDo'));

//Validate for spaces after our command
if (process.argv[4] != undefined) {
    console.log(chalk.bgRed('ERROR, MULTI-WORDS (Songs or Movie) HAVE TO BE SEPARATED BY DASH. ie: Home-alone, '));
    process.exit();
}

if ((command === "spotify" || command === "movie") && query == undefined ) {
    console.log(chalk.bgRed('ERROR, NO song or movie name was provided.'));
    process.exit();
}

executeCommand(command, query);

function executeCommand(command, query) {
    switch(command) {
        case('tweets'):
            findTweets(query);
            writeLog(command, query);
            break;
        case('movie'):
            findMovie(query);
            writeLog(command, query);
            break;
        case('spotify'):
            findSong(query);
            writeLog(command, query);
            break;
        case('todo'):
            readFile();
            writeLog(command, query);
            break;
        default:
            console.log(chalk.bgRed('\nError, please enter a command such as spotify, movie, tweets or todo.\n'));
            break;
    }
}

function findTweets() {
    console.log(chalk.blue("********* Searching Twitter ***********"))
    // twitter GET request
    var params = {user_id: query};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

      if (!error) {
        //console.log(tweets);
        for (var i = 0; i<tweets.length ; i++){
            console.log(tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at);
            var log = tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at + "\n";
        }
      } else {
          console.log("Got an error: "+ error);
      }
    });
}

function findMovie() {
    console.log(chalk.blue("********* Searching IMDB ***********"));
    var params = {
        apiKey: 'bdd0edf1',
        title: query,
        incTomatoes: true
    };
    omdbApi.get(params, function(err, data) {
        if (err) {
            return console.log(chalk.bgRed('\nSomething went wrong, movie name was not found on our servers.\n'));
        }
        // process response...
        //console.log(data)
        console.log(`Title: ${data.Title}.
    Year: ${data.Year}.
    IMDB Rating: ${data.imdbRating}.
    Rotten Tomatoes:${data.Ratings[1].Value}.
    Country: ${data.Country}.
    Language: ${data.Language}.
    Plot: ${data.Plot}.
    Actors: ${data.Actors}.`);
    });
}

function findSong(query) {
    spotify.search({ type: 'track', query: query, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + chalk.red(err));
        }
        var tracks = data.tracks.items;
        console.log(chalk.blue("********* Searching Spotify ***********"))
        if (tracks[0].preview_url == null) tracks[0].preview_url = "No preview Available!";// some results returned with null

        console.log(`Track: ${tracks[0].name}
Album: ${tracks[0].album.name}
Artist: ${tracks[0].artists[0].name}
Album URL: ${tracks[0].external_urls.spotify}
Track Preview: ${tracks[0].preview_url}`);
    });
}

function readFile() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        console.log(chalk.bgBlue("********* Reading File ***********"))
        console.log(`Your command is: ${data}`);
        var newCommand = data.split(","),
        newCommandName = newCommand[0],
        newCommandQuery = newCommand[1];
        newCommandQuery = newCommandQuery.replace(/"/g,''); //remove any quotation marks
        var query = newCommandQuery.replace(/\s/g,'-');// replaces all spaces represented as \s with dashes
        console.log(newCommandName);
        console.log(query);
        executeCommand(newCommandName, query);
    });
}

function writeLog(command, query) {
    if (query == undefined) query = "";
    let mylog = `Command: ${command} ${query}; is created at ${timeNow}\n`
    fs.appendFile('log.txt', mylog, function (err) {
        if (err) return err;
        console.log(chalk.red('Command Saved!'));
     });
}