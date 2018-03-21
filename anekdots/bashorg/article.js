var getRightNodes = function (nodes) {
    var result = null;

    if (nodes && nodes.length) {
        nodes = nodes[0].childNodes;
        if (nodes && nodes.length) {
            nodes = nodes.filter(function (child) {
                return child.nodeName !== "#text";
            });

            nodes = nodes[1];
            if (nodes && nodes.childNodes) {
                result = nodes.childNodes;
            }
        }
    }

    return result;
};

module.exports = function (nodes) {
    var result = null;

    nodes = getRightNodes(nodes);

    if (nodes.length) {
        result = '';

        nodes.forEach(function (child) {
            if (child.nodeName === '#text') {
                result += child.value;
            } else if (child.nodeName === 'br') {
                result += "\n";
            }
        });
    }

    return result;
}
