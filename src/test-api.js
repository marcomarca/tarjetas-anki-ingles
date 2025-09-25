const axios = require('axios');

async function testApi() {
    try {
        const response = await axios.post('http://localhost:3000/words', {
            word: 'certainly'
        });
        console.log('API Test successful!');
        console.log('Response:', response.data);
        process.exit(0);
    } catch (error) {
        console.error('API Test failed:');
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

// Small delay to give the server time to start
setTimeout(testApi, 2000);