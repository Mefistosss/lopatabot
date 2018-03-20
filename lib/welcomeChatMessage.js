var config = require('config');
var random = require('./random.js');

var messages = config.get('chatGoodMorningPhrases');
var members = config.get('chatMembers');
var punctuationMarks = ['.', '.', '.', '!', '!!!', '!!!!!!!!!'];

module.exports = function () {
    var msg = messages[random(messages.length - 1)];
    var mbr = members[random(members.length - 1)];

    if (mbr.length) {
        msg += " ";
    }

    msg += mbr;
    msg += punctuationMarks[random(punctuationMarks.length - 1)];

    return msg;
};
