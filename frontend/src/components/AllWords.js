import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function AllWords({ words, isLoading }) {

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
                            <th className="py-2 px-4 border-b text-left">Explanation</th>
                            <th className="py-2 px-4 border-b text-left">Next Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map((word) => (
                            <tr key={word.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b font-semibold">{word.palabra}</td>
                                <td className="py-2 px-4 border-b font-mono">{word.pronunciacion_IPA}</td>
                                <td className="py-2 px-4 border-b text-sm">{word.explicacion_es}</td>
                                <td className="py-2 px-4 border-b text-sm">{getTimeUntilNextReview(word.proximo_repaso)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllWords;