import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReviewCard() {
    const [card, setCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [message, setMessage] = useState('Loading card...');

    const fetchNextCard = useCallback(async () => {
        setIsFlipped(false);
        setMessage('Loading card...');
        try {
            const response = await axios.get('/review');
            setCard(response.data);
            setMessage('');
        } catch (error) {
            if (error.response?.status === 404) {
                setMessage('No more cards to review for now!');
            } else {
                setMessage('Error loading card.');
            }
            setCard(null);
        }
    }, []);

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
            await axios.put(`/review/${card.id}`, { performance });
            fetchNextCard(); // Load the next card
        } catch (error) {
            setMessage('Error updating card status.');
        }
    };

    const playAudio = (e) => {
        e.stopPropagation();
        if (card && card.audio_url) {
            const audio = new Audio(card.audio_url);
            audio.play();
        } else {
            alert('Audio not available for this word.');
        }
    };

    if (!card) {
        return <div><h2>Review</h2><p>{message}</p></div>;
    }

    return (
        <div>
            <h2>Review</h2>
            <div onClick={handleFlip} style={{ border: '1px solid black', padding: '20px', cursor: 'pointer', minHeight: '150px' }}>
                {!isFlipped ? (
                    <div>
                        <h3>{card.palabra}</h3>
                    </div>
                ) : (
                    <div>
                        <p><strong>IPA:</strong> {card.pronunciacion_IPA}</p>
                        <p><strong>Explicación:</strong> {card.explicacion_es}</p>
                        <button onClick={playAudio}>
                            Play Audio
                        </button>
                    </div>
                )}
            </div>
            {isFlipped && (
                 <div style={{marginTop: '10px'}}>
                    <button onClick={() => handlePerformance('fail')}>Fail</button>
                    <button onClick={() => handlePerformance('doubtful')}>Doubtful</button>
                    <button onClick={() => handlePerformance('correct')}>Correct</button>
                </div>
            )}
        </div>
    );
}

export default ReviewCard;