const { Op, Sequelize } = require('sequelize');
const sequelize = require('../database');
const Word = require('../models/Word');

/**
 * Calculates the next review date for a card based on its current difficulty and performance.
 * This is a simplified version of the SM-2 algorithm.
 * @param {Word} word - The word to update.
 * @param {string} performance - The user's performance ('fail', 'doubtful', 'correct').
 */
function updateReviewSchedule(word, performance) {
    let { nivel_dificultad } = word;

    const now = new Date();
    word.fecha_ultimo_repaso = now;

    if (performance === 'fail') {
        word.nivel_dificultad = 0;
        // Make it available for review again immediately
        word.proximo_repaso = now;
    } else {
        if (performance === 'doubtful') {
            nivel_dificultad = Math.max(0, nivel_dificultad - 1);
        } else if (performance === 'correct') {
            nivel_dificultad += 1;
        }

        const interval = Math.pow(2, nivel_dificultad);
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        word.nivel_dificultad = nivel_dificultad;
        word.proximo_repaso = nextReview;
    }

    return word;
}


/**
 * Fetches the next word to be reviewed.
 * It prioritizes new cards and then cards that are due for review.
 */
async function getNextReviewWord() {
    const now = new Date();

    // 1. Prioritize new cards (never reviewed)
    let word = await Word.findOne({
        where: { fecha_ultimo_repaso: null },
        order: [['fecha_creacion', 'ASC']]
    });

    if (word) {
        return word;
    }

    // 2. Find cards that are due for review
    word = await Word.findOne({
        where: {
            proximo_repaso: {
                [Op.lte]: now
            }
        },
        order: [['proximo_repaso', 'ASC']]
    });

    return word;
}

/**
 * Fetches a random word from the database.
 */
async function getRandomWord() {
    const word = await Word.findOne({
        order: sequelize.random(),
    });
    return word;
}

module.exports = {
    updateReviewSchedule,
    getNextReviewWord,
    getRandomWord
};