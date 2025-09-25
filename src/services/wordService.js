const axios = require('axios');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');
const Word = require('../models/Word');

const publicAudioDir = path.join(__dirname, '../../public/audio');
if (!fs.existsSync(publicAudioDir)) {
    fs.mkdirSync(publicAudioDir, { recursive: true });
}

// Client will be initialized on first use to handle auth errors gracefully.
let ttsClient = null;
let isTtsClientInitialized = false;

// TODO: This will require authentication to be set up in the environment.
// For local development, you can use `gcloud auth application-default login`.
// In a production environment, you should use a service account.
// See: https://cloud.google.com/docs/authentication/external/set-up-adc-local
async function getTtsClient() {
    if (isTtsClientInitialized) {
        return ttsClient;
    }

    try {
        // The constructor may throw an error if auth is not configured.
        ttsClient = new textToSpeech.TextToSpeechClient();
        isTtsClientInitialized = true;
        return ttsClient;
    } catch (error) {
        console.warn(`Could not initialize Google Text-to-Speech client. Audio generation will be disabled. Error: ${error.message}`);
        ttsClient = null;
        isTtsClientInitialized = true; // Mark as initialized to prevent retries
        return null;
    }
}

async function getPronunciation(word) {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const phonetic = response.data[0]?.phonetic || response.data[0]?.phonetics?.find(p => p.text)?.text;
        return phonetic || 'N/A';
    } catch (error) {
        console.error('Could not fetch pronunciation:', error.message);
        return 'N/A';
    }
}

async function generateAudio(word) {
    const audioPath = path.join(publicAudioDir, `${word}.mp3`);
    const audioUrl = `/audio/${word}.mp3`;

    if (fs.existsSync(audioPath)) {
        console.log(`Audio for "${word}" already exists.`);
        return audioUrl;
    }

    const client = await getTtsClient();
    if (!client) {
        console.warn(`Skipping audio generation for "${word}" because the TTS client is not available.`);
        return null;
    }

    try {
        console.log(`Generating audio for "${word}"...`);
        const request = {
            input: { text: word },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // The synthesizeSpeech method can also throw if auth fails at runtime
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(audioPath, response.audioContent, 'binary');
        console.log(`Audio content for "${word}" written to file: ${audioPath}`);
        return audioUrl;

    } catch (error) {
        console.error(`Could not generate audio for "${word}":`, error.message);
        return null;
    }
}

async function processAndSaveWord(word) {
    const existingWord = await Word.findOne({ where: { palabra: word } });
    if (existingWord) {
        console.log(`Word "${word}" already exists in the database.`);
        return existingWord;
    }

    const pronunciacion_IPA = await getPronunciation(word);
    const audio_url = await generateAudio(word);

    // Placeholder for AI-generated explanation
    const explicacion_es = `Pronunciación de ${word}... (placeholder)`;

    const newWord = await Word.create({
        palabra: word,
        pronunciacion_IPA,
        audio_url,
        explicacion_es,
        etiquetas: 'general'
    });

    return newWord;
}

module.exports = { processAndSaveWord };