import React, { useState } from 'react';
import axios from 'axios';

function AddWordForm({ onWordAdded }) {
    const [word, setWord] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('/words', { word });
            setMessage(`Successfully added "${response.data.palabra}"!`);
            setWord('');
            if(onWordAdded) {
                onWordAdded(response.data);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred.';
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Add New Word</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Enter an English word"
                        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Word'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>
    );
}

export default AddWordForm;