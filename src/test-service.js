const sequelize = require('./database');
const { processAndSaveWord } = require('./services/wordService');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

async function runTest() {
    // 1. Clean up database and audio file for a fresh run
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('Previous database deleted.');
    }
    const audioFile = path.join(__dirname, '../public/audio/hello.mp3');
    if (fs.existsSync(audioFile)) {
        fs.unlinkSync(audioFile);
        console.log('Previous audio file deleted.');
    }

    // 2. Sync database
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // 3. Run the service function
    console.log('Processing word "hello"...');
    const result = await processAndSaveWord('hello');

    // 4. Log the result
    console.log('Service function finished.');
    console.log('Result:', result.toJSON());

    // 5. Verify audio file creation
    if (fs.existsSync(audioFile)) {
        console.log('SUCCESS: Audio file "hello.mp3" was created.');
    } else {
        console.error('FAILURE: Audio file "hello.mp3" was NOT created.');
    }

    await sequelize.close();
}

runTest().catch(err => {
    console.error('Test script failed:', err);
    process.exit(1);
});