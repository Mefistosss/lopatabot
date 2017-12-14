const config = require('config');
const random = require('./random.js');

const messages = config.get('chatGoodMorningPhrases');
const members = config.get('chatMembers');
const punctuationMarks = ['.', '.', '.', '!', '!!!', '!!!!!!!!!'];

module.exports = function () {
    let msg = messages[random(messages.length - 1)];
    let mbr = members[random(members.length - 1)];

    if (mbr.length) {
        msg += " ";
    }

    msg += mbr;
    msg += punctuationMarks[random(punctuationMarks.length - 1)];

    return msg;
};
