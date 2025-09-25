const textToSpeech = require('@google-cloud/text-to-speech');

// Globally catch unhandled promise rejections to prevent the process from crashing.
// This is necessary because the Google Cloud library can have background tasks
// that fail and would otherwise terminate the Node.js process.
process.on('unhandledRejection', (reason, promise) => {
    console.warn('Caught unhandled promise rejection:', reason.message);
    // In a real application, you might want to log this to a monitoring service.
    // For this test, we just prevent the crash.
});


async function runMinimalTest() {
    console.log('Starting minimal TTS test...');
    try {
        const client = new textToSpeech.TextToSpeechClient();
        const request = {
            input: { text: 'hello' },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };
        await client.synthesizeSpeech(request);
    } catch (error) {
        console.log('SUCCESS: The error was caught gracefully by the try...catch block.');
        console.error('Caught error message:', error.message);
    }
    console.log('Minimal TTS test finished.');
}

runMinimalTest();