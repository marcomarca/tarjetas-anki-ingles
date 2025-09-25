const assert = require('assert');
const sequelize = require('./database');

// Gracefully handle unhandled promise rejections for the Google Cloud client
process.on('unhandledRejection', (reason, promise) => {
    console.warn('[TEST-SRS] Unhandled Promise Rejection:', reason.message);
});

const { processAndSaveWord } = require('./services/wordService');
const { getNextReviewWord, updateReviewSchedule } = require('./services/srsService');
const Word = require('./models/Word');

async function runSrsTest() {
    console.log('Starting SRS test...');

    // 1. Setup: Clean database and create a few words
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    await processAndSaveWord('apple');
    await processAndSaveWord('banana');
    console.log('Test words created.');

    // 2. Test getNextReviewWord() - should be the first word created
    const nextWord = await getNextReviewWord();
    assert.strictEqual(nextWord.palabra, 'apple', 'Test Failed: First review word should be "apple"');
    console.log('SUCCESS: getNextReviewWord() fetched the correct new word.');

    // 3. Test updateReviewSchedule() - marking the word as 'correct'
    let updatedWord = updateReviewSchedule(nextWord, 'correct');
    await updatedWord.save();

    const today = new Date();
    const nextReviewDate = new Date(updatedWord.proximo_repaso);

    // The interval for the first correct answer is 2^1 = 2 days.
    // We check if the next review is roughly 2 days in the future.
    const diffDays = Math.ceil((nextReviewDate - today) / (1000 * 60 * 60 * 24));
    assert.strictEqual(diffDays, 2, 'Test Failed: Next review date should be in 2 days for "correct"');
    console.log('SUCCESS: updateReviewSchedule() correctly set the next review date for "correct".');

    // 4. Test with another word and 'fail' performance
    const secondWord = await getNextReviewWord();
    assert.strictEqual(secondWord.palabra, 'banana', 'Test Failed: Second review word should be "banana"');

    updatedWord = updateReviewSchedule(secondWord, 'fail');
    await updatedWord.save();

    const nextReviewDateFail = new Date(updatedWord.proximo_repaso);
    const timeDiffFail = Math.abs(nextReviewDateFail.getTime() - today.getTime());
    assert(timeDiffFail < 1000, 'Test Failed: Next review date should be immediate for "fail"');
    console.log('SUCCESS: updateReviewSchedule() correctly set the next review date for "fail".');


    console.log('All SRS tests passed!');
    await sequelize.close();
}

runSrsTest().catch(err => {
    console.error('SRS Test script failed:', err);
    process.exit(1);
});