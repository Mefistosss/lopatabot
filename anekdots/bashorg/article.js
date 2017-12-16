let getRightNodes = (nodes) => {
    let result = null;

    if (nodes && nodes.length) {
        nodes = nodes[0].childNodes;
        if (nodes && nodes.length) {
            nodes = nodes.filter((child) => {
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
    let result = null;

    nodes = getRightNodes(nodes);

    if (nodes.length) {
        result = '';

        nodes.forEach((child) => {
            if (child.nodeName === '#text') {
                result += child.value;
            } else if (child.nodeName === 'br') {
                result += "\n";
            }
        });
    }

    return result;
}
