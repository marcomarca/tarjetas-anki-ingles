import React, { useState } from 'react';
import axios from 'axios';

function AddWordForm() {
    const [word, setWord] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('/words', { word });
            setMessage(`Successfully added "${response.data.palabra}"!`);
            setWord('');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred.';
            setMessage(`Error: ${errorMessage}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add New Word</h2>
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter an English word"
                    required
                />
                <button type="submit">Add Word</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddWordForm;