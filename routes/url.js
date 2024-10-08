const express = require('express');
const router = express.Router();
const { customAlphabet } = require('nanoid');
const validator = require('validator');
const { urlModel } = require('../models/Url');

router.get('/', (req, res) => {
    res.send('hi');
})

router.post('/shorten', async (req, res) => {

    const { longUrl, customShortCode } = req.body;

    if (!validator.isURL(longUrl, { require_protocol: true })) {
        return res.status(400).json({ error: 'Invalid URL' })
    }

    const baseUrl = process.env.BASE_URL;

    try {

        let url = await urlModel.findOne({ longUrl });

        if (url) {

            res.json(url);

        } else {

            if (customShortCode) {

                const regEgx = /^[a-c|1-3]{5}$/;

                if (!regEgx.test(customShortCode)) {
                    return res.status(400).json({ error: 'Custom short code is invalid' })
                }

                const existingCode = await urlModel.findOne({ shortCode: customShortCode });

                if (existingCode) {
                    return res.status(400).json({ error: 'Custom short code is already in use.' });
                }

                const shortUrl = `${baseUrl}/${customShortCode}`;
                url = new urlModel({ longUrl, shortUrl, shortCode: customShortCode });

            } else {

                const shortCode = customAlphabet('1234abc', 5);
                const shortUrl = `${baseUrl}/${shortCode}`;
                url = new urlModel({ longUrl, shortUrl, shortCode });

            }

            await url.save();
            res.json(url);

        }

    } catch (err) {

        console.error(err);
        res.status(500).json('Server error');

    }
});

router.get('/:shortCode', async (req, res) => {

    try {

        const url = await urlModel.findOne({ shortCode: req.params.shortCode });

        if (url) {

            url.clicks += 1;
            await url.save();

            // return res.redirect(url.longUrl);
            return res.json(url.clicks);


        } else {

            return res.status(404).json('No URL found');

        }
    } catch (err) {

        console.error(err);
        res.status(500).json('Server error');
    }

});

module.exports = router;