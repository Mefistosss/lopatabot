module.exports = function (msg, type) {
    let result = '';

    result += "`<" + type + ">`\n";
    result += msg + "\n";
    result += "`</" + type + ">`";

    return result.toString();
};
