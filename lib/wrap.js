module.exports = function (msg) {
    let result = '';

    result += "`<лопата>`\n";
    result += msg + "\n";
    result += "`</лопата>`";

    return result.toString();
};
