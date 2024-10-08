var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var {buildHeadingStructure, restructureHeadingsDynamic, countHeadings, injectFontSize} = require('../libs/heading');

/* GET return a JSON response */
router.get('/', async function (req, res, next) {
    try {
        const {url} = req.query;

        if (!url) {
            return res.status(400).json({status: 'error', message: 'URL parameter is required'});
        }

        // Fetch the page content
        const {data: html} = await axios.get(url);
        const $ = cheerio.load(html);

        // Get all heading elements (h1 to h6)
        const headings = $('h1, h2, h3, h4, h5, h6');

        let structure = buildHeadingStructure($, headings);

        // based on headings, count how much of each type of heading there is on structure
        const headingCount = countHeadings(structure);

        // restructure
        structure = restructureHeadingsDynamic(structure);

        res.json({
            status: 'ok',
            data: {
                summary: headingCount,
                structure,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to scrape the page',
        });
    }
});

module.exports = router;
