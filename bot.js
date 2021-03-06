//Libraries
const Discord = require('discord.io');
const auth = require('./auth.json');
const debug = require("./debugUtils.js");
const colors = require('colors');
const fs = require('fs');
const process = require("process");

//CONSTANTS

const UNKNOWN_COMMAND_MESSAGE = [    // Will pick one of these as the message to display if an unknown command is entered
	"ERROR - unknown command",
	"I dont understand what you mean, please try again"
];


//GLOBAL VARIABLE GARBAGE

let lastMessageChannelID; // Saves the most recent message sent on a channel visible to the bot
let allCommands = []; //Master command array


// Initialize everything

debug.log("Initializing bot ...");

let bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

let doc = loadJSON("JSON/docs.json");
let alias = loadJSON("JSON/aliases.json");

debug.logSuccess("JSON Loading Complete");


bot.on('ready', function (evt) {
	debug.logSuccess("Connected to bot");
	debug.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

	lastMessageChannelID = channelID;

    if (message.substring(0, 1) === '!' && userID == "173823924025556993") { //Keyword for now, prob gunna change later
        let args = message.substring(1).split(' '); // Split at spaces
        let cmd = args[0].toLowerCase(); //after ! but before x y z args  --->       !______ x y z

        args = args.splice(1); // list of everything after !command

		allCommands.forEach(function(command){  // for each command in the master list
			if(command.name == cmd){  //If the command has an alias in this command's alias list
				debug.log("Executing command: " + command.name);
				command.execute(user, userID, channelID, message, cmd, args);
				debug.log("Complete: " + command.name);
			}
		});
	}
});

//Setup commands

/**
  Class used to store command information. Automatically added to the master class array

  Command name              :    String
  Command aliases           :    List
  Command documentation     :    String
  Command Logic             :    Function
 */
class command{

	/**
	 * @param name STRING : ame of the command, only gets used when looking at the command in a menu
	 * @param aliases LIST : STRING : a list of aliases used by this command
	 * @param documentation STRING : documentation regarding the command. Please include example usage if it can use arguments
	 * @param logic FUNCTION : the function to be run when this command is called. make sure it takes in (user, userID, channelID, message, cmd, args)
	 */
	constructor(name, logic){

		this.name = name;
		this.logic = logic;

		allCommands.push(this); //Add this command to the master list

	}

	execute(user, userID, channelID, message, cmd, args){
		try{
			this.logic(user, userID, channelID, message, cmd, args);
		}catch(e){
			debug.logError("ERROR running " + command.name);
			debug.logDetails(e);
		}
	}
}

//Commands

new command("echo", function(user, userID, channelID, message, cmd, args){
	let batch = "";

	args.forEach(function(arg){
		batch += arg + " ";
	});

	sendMessage(batch);
});

new command("getallusers", function(user, userID, channelID, message, cmd, args){

	let server = bot.servers[args[0]];
	let members = server.members;

	for(let id in members){
		let batch = "";

		members[id].roles.forEach(function(rID){
			batch += server.roles[rID].name + " - ";

		});

		console.log(colors.green(getUser(id).username) + " | " + colors.red(batch));
	}


});

new command("postad", function t(user, userID, channelID, message, cmd, args){

	postAd();
	setTimeout(function(){
		t(user, userID, channelID, message, cmd, args);

	}, 60000 * 60 * 6.2);
});

function getUser(memberID) {
	let user = bot.users[memberID];
	return user;
}

function postAd(){
	sendMessage("Posting message");
	fs.readFile("./ad.txt", 'utf8', function(err, data) {
		if (err) throw err;
		uploadFile(data);
	});
}

/**
 * Sends message to the channel with ID ChannelID
 * @param message STRING : message to be sent
 * @param channelID INT : channelID that the message should be sent to. (You get this manually in discord its static)
 */
function sendMessage(message,channelID = "173823924025556993"){

	bot.sendMessage( { to: channelID, message: message}, function(error, response){
		if(error){
			debug.logError("Sending Message Failed");
			debug.logDetails(response);
		}else{
			debug.log("Sent Message : " + colors.grey(message.split("\n")[0])); //Only prints the first line of the message for readability of logs
		}
	});

}

function uploadFile(message, fileLinks = "", channelID = "583937326527545344"){
	bot.uploadFile( { to: channelID, message: message, file: "./The Machine_Poster.png"});
	debug.log("Sent Message : " + colors.grey(message.split("\n")[0])); //Only prints the first line of the message for readability of logs
}

/**
 * Loads the given JSON file and returns an object representing its data
 * @param file STRING : file location
 * @returns {any} object representing JSON data
 */
function loadJSON(file){
	//TODO: add try catches for error handling
	let startTime = process.hrtime();

	let rawJSON = fs.readFileSync(file);
	let parsedJSON = JSON.parse(rawJSON);

	debug.log(file + " loaded successfully in " + process.hrtime(startTime)[1]/1000000 + " ms");

	return parsedJSON;

}

/**
 * Randomly selects an item from the list and returns it
 * @param randomList LIST : OBJECT a list of objects
 * @returns item OBJECT : item of the list
 */
function selectRandomFromList(randomList){

	let randomIndex = Math.floor(Math.random() * (randomList.length + 1)); // floor to convert to int. (max + 1) becuase otherwise it is exclusive upper range
	return randomList[randomIndex];

}


