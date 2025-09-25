import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReviewCard() {
    const [card, setCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [message, setMessage] = useState('Loading card...');
    const [isCramMode, setIsCramMode] = useState(false);

    const fetchNextCard = useCallback(async () => {
        setIsFlipped(false);
        setMessage('Loading card...');
        const url = isCramMode ? '/review?mode=cram' : '/review';
        try {
            const response = await axios.get(url);
            setCard(response.data);
            setMessage('');
        } catch (error) {
            if (error.response?.status === 404) {
                setMessage('No more cards to review for now! Add some new words.');
            } else {
                setMessage('Error loading card.');
            }
            setCard(null);
        }
    }, [isCramMode]);

    useEffect(() => {
        fetchNextCard();
    }, [fetchNextCard]);

    const handleFlip = () => {
        if (card) {
            setIsFlipped(!isFlipped);
        }
    };

    const handlePerformance = async (performance) => {
        if (!card) return;

        try {
            const payload = { performance };
            if (isCramMode) {
                payload.mode = 'cram';
            }
            await axios.put(`/review/${card.id}`, payload);
            fetchNextCard(); // Load the next card
        } catch (error) {
            setMessage('Error updating card status.');
        }
    };

    const playAudio = (e) => {
        e.stopPropagation();
        if (card && card.audio_url) {
            // Prepend the backend server URL if it's a relative path
            const audioUrl = card.audio_url.startsWith('/') ? `${window.location.origin}${card.audio_url}` : card.audio_url;
            const audio = new Audio(audioUrl);
            audio.play().catch(err => console.error("Audio play failed:", err));
        } else {
            alert('Audio not available for this word.');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-center">Review</h2>
                <button
                    onClick={() => setIsCramMode(!isCramMode)}
                    className={`px-4 py-2 rounded-md ${isCramMode ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                    {isCramMode ? 'Cram Mode Active!' : 'Start Cram Session'}
                </button>
            </div>

            {!card ? (
                <div className="text-center">
                    <p>{message}</p>
                </div>
            ) : (
                <>
                    <div className="perspective-1000">
                        <div
                            className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                            onClick={handleFlip}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Front of the card */}
                            <div className="absolute w-full h-full backface-hidden bg-blue-100 rounded-lg flex items-center justify-center p-4">
                                <h3 className="text-3xl font-bold">{card.palabra}</h3>
                            </div>
                            {/* Back of the card */}
                            <div className="absolute w-full h-full backface-hidden bg-green-100 rounded-lg flex flex-col items-center justify-center p-4 rotate-y-180">
                                <p className="font-mono text-lg">{card.pronunciacion_IPA}</p>
                                <p className="mt-2 text-center">{card.explicacion_es}</p>
                                <button
                                    onClick={playAudio}
                                    className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                                >
                                    Play Audio
                                </button>
                            </div>
                        </div>
                    </div>
                    {isFlipped && (
                         <div className="mt-6 flex justify-around">
                            <button onClick={() => handlePerformance('fail')} className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Fail</button>
                            <button onClick={() => handlePerformance('doubtful')} className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Doubtful</button>
                            <button onClick={() => handlePerformance('correct')} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Correct</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ReviewCard;