const express = require('express');
const router = express.Router();
const { processAndSaveWord } = require('../services/wordService');
const Word = require('../models/Word');

// GET all words
router.get('/', async (req, res) => {
    try {
        const words = await Word.findAll({
            order: [['fecha_creacion', 'DESC']]
        });
        res.json(words);
    } catch (error) {
        console.error('Error fetching all words:', error);
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

router.post('/', async (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).json({ error: 'Word is required' });
    }

    try {
        const newWord = await processAndSaveWord(word.toLowerCase().trim());
        res.status(201).json(newWord);
    } catch (error) {
        console.error('Error processing word:', error);
        res.status(500).json({ error: 'Failed to process word' });
    }
});

module.exports = router;