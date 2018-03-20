module.exports = function (msg, type) {
    var result = '';

    result += "`<" + type + ">`\n";
    result += msg + "\n";
    result += "`</" + type + ">`";

    return result.toString();
};
