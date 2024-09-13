const buildHeadingStructure = ($, parent) => {
    const result = [];
    parent.each((index, element) => {
        const type = element.tagName;
        const text = $(element).text().trim();
        // count the number of characters in the text withou spaces
        const charTextCount = text.replace(/\s/g, '').length;
        const nextSibling = $(element).nextUntil(type);

        const children = nextSibling.filter((i, sibling) => {
            return sibling.tagName && sibling.tagName.startsWith('h') && sibling.tagName > type;
        });

        const childStructure = buildHeadingStructure($, children);

        result.push({
            type,
            text,
            textCount: charTextCount,
            child: childStructure.length ? childStructure : null,
        });
    });

    return result;
};

module.exports = buildHeadingStructure;
