
let colors = require("colors");

/**
 * Logs warning in yellow
 * @param message message to be logged
 */
exports.logWarning = function(message){

    console.log("[" + colors.yellow("!") + "] " + message);
};

/**
 * Logs urgent error in red
 * @param message message to be logged
 */
exports.logError = function(message){

    console.log("[" + colors.red("!") + "] " + message);

};

/**
 * Logs a successful message in green
 * @param message message to be logged
 */
exports.logSuccess = function(message){

    console.log("[" + colors.green("!") + "] " + message);

};

/**
 * logs a regular green message as a status update
 * @param message message to be logged
 */
exports.log = function(message){

    console.log("[" + colors.green("*") + "] " + message);

};

/**
 * logs debug test info as yellow asterisk and green text
 * @param message debug test info
 */
exports.logTest = function(message){

    console.log("[" + colors.yellow("*") + "] " + colors.green(message));

};





