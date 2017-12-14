const welcomeChatMessage = require('./welcomeChatMessage');

module.exports = function(message, type) {
    let result;
    switch(type) {
        case 'morning':
            result = welcomeChatMessage();
            result += "\n\n";
            result += message;
            break;
        default:
            result = message;
    }

    return result;
};
