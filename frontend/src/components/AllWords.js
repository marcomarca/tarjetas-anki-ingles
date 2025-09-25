import React from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import EditableField from './EditableField';

function AllWords({ words, isLoading, setWords }) {

    const handleDelete = async (wordId) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            try {
                await axios.delete(`/words/${wordId}`);
                setWords(currentWords => currentWords.filter(w => w.id !== wordId));
            } catch (error) {
                console.error('Failed to delete word', error);
                alert('Failed to delete word.');
            }
        }
    };

    const handleUpdateWord = async (wordId, field, value) => {
        try {
            const response = await axios.put(`/words/${wordId}`, { [field]: value });
            // Update the state locally to reflect the change immediately
            setWords(currentWords =>
                currentWords.map(w => w.id === wordId ? response.data : w)
            );
        } catch (error) {
            console.error(`Failed to update ${field}`, error);
            // Optionally, show an error message to the user
        }
    };

    const getTimeUntilNextReview = (date) => {
        if (!date) return 'Not reviewed yet';
        const nextReviewDate = new Date(date);
        const now = new Date();
        if (nextReviewDate < now) {
            return 'Ready for review';
        }
        return `In ${formatDistanceToNow(nextReviewDate)}`;
    };

    if (isLoading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold mb-4">All Words</h2>
                <p>Loading words...</p>
            </div>
        );
    }

    if (words.length === 0) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold mb-4">All Words</h2>
                <p>No words found. Add some new words to get started!</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">All Words ({words.length})</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Word</th>
                            <th className="py-2 px-4 border-b text-left">IPA</th>
                            <th className="py-2 px-4 border-b text-left">Notes</th>
                            <th className="py-2 px-4 border-b text-left">Tags</th>
                            <th className="py-2 px-4 border-b text-left">Next Review</th>
                            <th className="py-2 px-4 border-b text-left">Extra Reviews</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map((word) => (
                            <tr key={word.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b font-semibold">{word.palabra}</td>
                                <td className="py-2 px-4 border-b font-mono">{word.pronunciacion_IPA}</td>
                                <td className="py-2 px-4 border-b text-sm">
                                    <EditableField
                                        initialValue={word.notes}
                                        onSave={(newValue) => handleUpdateWord(word.id, 'notes', newValue)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b text-sm">
                                    <EditableField
                                        initialValue={word.etiquetas}
                                        onSave={(newValue) => handleUpdateWord(word.id, 'etiquetas', newValue)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b text-sm">{getTimeUntilNextReview(word.proximo_repaso)}</td>
                                <td className="py-2 px-4 border-b text-center">{word.extra_reviews_count}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleDelete(word.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllWords;