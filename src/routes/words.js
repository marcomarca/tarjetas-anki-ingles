const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
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
    const { word, notes } = req.body;
    if (!word) {
        return res.status(400).json({ error: 'Word is required' });
    }

    try {
        const newWord = await processAndSaveWord(word.toLowerCase().trim(), notes);
        res.status(201).json(newWord);
    } catch (error) {
        console.error('Error processing word:', error);
        res.status(500).json({ error: 'Failed to process word' });
    }
});

// DELETE a word
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const word = await Word.findByPk(id);
        if (!word) {
            return res.status(404).json({ error: 'Word not found' });
        }

        // Delete audio file if it exists
        if (word.audio_url) {
            const audioPath = path.join(__dirname, `../../public${word.audio_url}`);
            if (fs.existsSync(audioPath)) {
                fs.unlinkSync(audioPath);
            }
        }

        await word.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ error: 'Failed to delete word' });
    }
});

// PUT to update a word's notes or tags
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { notes, etiquetas } = req.body;

    try {
        const word = await Word.findByPk(id);
        if (!word) {
            return res.status(404).json({ error: 'Word not found' });
        }

        if (notes !== undefined) {
            word.notes = notes;
        }
        if (etiquetas !== undefined) {
            word.etiquetas = etiquetas;
        }

        await word.save();
        res.json(word);
    } catch (error) {
        console.error('Error updating word:', error);
        res.status(500).json({ error: 'Failed to update word' });
    }
});

module.exports = router;