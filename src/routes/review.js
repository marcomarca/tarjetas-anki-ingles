const express = require('express');
const router = express.Router();
const { getNextReviewWord, getRandomWord } = require('../services/srsService');
const Word = require('../models/Word');

// GET the next card to review
router.get('/', async (req, res) => {
    const { mode } = req.query; // mode=cram
    try {
        let word;
        if (mode === 'cram') {
            word = await getRandomWord();
        } else {
            word = await getNextReviewWord();
        }

        if (!word) {
            return res.status(404).json({ message: 'No cards to review at this time.' });
        }
        res.json(word);
    } catch (error) {
        console.error('Error fetching next review word:', error);
        res.status(500).json({ error: 'Failed to fetch review word' });
    }
});

const { updateReviewSchedule } = require('../services/srsService');

// PUT to update a card's review status
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { performance, mode } = req.body; // 'fail', 'doubtful', 'correct', mode='cram'

    if (!['fail', 'doubtful', 'correct'].includes(performance)) {
        return res.status(400).json({ error: 'Invalid performance value.' });
    }

    try {
        const word = await Word.findByPk(id);
        if (!word) {
            return res.status(404).json({ error: 'Word not found.' });
        }

        if (mode === 'cram') {
            word.extra_reviews_count += 1;
            await word.save();
            res.json(word);
        } else {
            const updatedWord = updateReviewSchedule(word, performance);
            await updatedWord.save();
            res.json(updatedWord);
        }

    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ error: 'Failed to update review status' });
    }
});

module.exports = router;