var welcomeChatMessage = require('./welcomeChatMessage.js');

module.exports = function (values) {
    var result = '';

    if (values.isAdded) {
        switch (values.type) {
            case 'group':
                result = welcomeChatMessage(true);
                result += '\n';
                result += 'Теперь, я буду дарить вам счастье.';
                break;
            case 'private':
                result = 'Привет ' + (values.name || '');
                result += '\n';
                result += 'Теперь, я буду дарить тебе счастье.';
                break;
        }
    } else {
        result = 'Очень, оооочень грустно.\n';
        switch (values.type) {
            case 'group':
                result += 'Меньше всего, такого я ожидал от вас!';
                result += '\n';
                result += 'Больше не буду присылать вам анекдотики!';
                break;
                result
            case 'private':
                result += ((values.name || '') + ', я что, тебе не нравлюсь?');
                result += '\n';
                result += 'Больше не буду присылать тебе анекдотики!';
                break;
        }
    }

    return result;
};

