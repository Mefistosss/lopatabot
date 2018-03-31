var config = require('config');
var random = require('./random.js');

var messages = config.get('chatGoodMorningPhrases');
var members = config.get('chatMembers');
var punctuationMarks = ['.', '.', '.', '!', '!!!', '!!!!!!!!!'];

module.exports = function (withOutMorning) {
    var msg, mbr;

    do {
        msg = messages[random(messages.length - 1)];
    } while (withOutMorning && /утро/i.test(msg))
    
    mbr = members[random(members.length - 1)];

    if (mbr.length) {
        msg += " ";
    }

    msg += mbr;
    msg += punctuationMarks[random(punctuationMarks.length - 1)];

    return msg;
};
