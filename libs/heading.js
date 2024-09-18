const buildHeadingStructure = ($, parent) => {
    const result = [];
    parent.each((index, element) => {
        console.log("element", element);
        const type = element.tagName;
        const text = $(element).text().trim();
        // count the number of characters in the text withou spaces
        const charTextCount = text.replace(/\s/g, '').length;

        result.push({
            type,
            text,
            textCount: charTextCount,
        });
    });

    return result;
};

function restructureHeadingsDynamic(structure) {
    const result = [];
    const stack = []; // A stack to keep track of current heading levels

    structure.forEach(item => {
        const level = parseInt(item.type.replace('h', '')); // Get the heading level (1 for h1, 2 for h2, etc.)

        // Remove any headings from the stack that are at a higher or equal level
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        const expectedLevel = stack.length > 0 ? stack[stack.length - 1].level + 1 : 1;
        const newItem = { ...item, child: [], message: null };

        if (level !== expectedLevel) {
            // If the current level is not the expected level, add a message
            newItem.message = `${item.type} found, expected h${expectedLevel}`;
        }

        if (stack.length === 0) {
            // If the stack is empty, we're at the top level (h1)
            result.push(newItem);
        } else {
            // Otherwise, add this item as a child of the last item in the stack
            stack[stack.length - 1].item.child.push(newItem);
        }

        // Add this item to the stack
        stack.push({ level, item: newItem });
    });

    // Post-process: Set 'child' to null if there are no children
    function setChildNullIfEmpty(node) {
        if (node.child.length === 0) {
            node.child = null;
        } else {
            node.child.forEach(setChildNullIfEmpty); // Recursively process children
        }
    }

    result.forEach(setChildNullIfEmpty); // Apply to all top-level nodes

    return result;
}

function countHeadings(structure) {
    const summary = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

    structure.forEach(item => {
        const headingType = item.type;
        if (summary.hasOwnProperty(headingType)) {
            summary[headingType]++;
        }
    });

    return summary;
}

module.exports = {
    buildHeadingStructure,
    restructureHeadingsDynamic,
    countHeadings
};
