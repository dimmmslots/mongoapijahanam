const express = require('express');
const Barang = require('../models/barang.js');
const router = express.Router();

router.get('/', async (req, res) => {
    const barang = await Barang.find({});
    try {
        res.json(barang);
    }
    catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;