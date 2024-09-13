var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var buildHeadingStructure = require('../libs/heading');

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

        const structure = buildHeadingStructure($, headings);

        res.json({
            status: 'ok',
            data: {
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
