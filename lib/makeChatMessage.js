var welcomeChatMessage = require('./welcomeChatMessage');

module.exports = function (message, type, nameOfPerson) {
    var result;
    switch(type) {
        case 'morning':
            if (nameOfPerson) {
                result = "Доброе утро " + nameOfPerson + "!";
            } else {
                result = welcomeChatMessage();
            }

            result += "\n\n";
            result += message;
            break;
        case 'coub':
            if (nameOfPerson) {
                result = "Вот лови " + nameOfPerson + ", пусть скука покинет тебя!";
            } else {
                result = "А вот и опять я, с новеньким coub.";
            }

            result += "\n\n";
            result += message;
            break;
        default:
            result = message;
    }

    return result;
};
