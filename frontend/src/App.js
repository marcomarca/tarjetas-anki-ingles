import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddWordForm from './components/AddWordForm';
import ReviewCard from './components/ReviewCard';
import AllWords from './components/AllWords';

function App() {
  const [activeTab, setActiveTab] = useState('review');
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
        try {
            const response = await axios.get('/words');
            setWords(response.data);
        } catch (error) {
            console.error("Failed to fetch words", error);
        } finally {
            setIsLoading(false);
        }
    };
    if (activeTab === 'all-words') {
        fetchWords();
    }
  }, [activeTab]);

  const handleWordAdded = (newWord) => {
    setWords(prevWords => [newWord, ...prevWords]);
    setActiveTab('all-words');
  };

  return (
    <div className="App bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800">Pronunciation Flashcards</h1>
        </header>

        <div className="mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('review')}
              className={`py-2 px-4 ${activeTab === 'review' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
            >
              Review
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
            >
              Add Word
            </button>
            <button
              onClick={() => setActiveTab('all-words')}
              className={`py-2 px-4 ${activeTab === 'all-words' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
            >
              All Words
            </button>
          </div>
        </div>

        <main>
          {activeTab === 'review' && <ReviewCard />}
          {activeTab === 'add' && <AddWordForm onWordAdded={handleWordAdded} />}
          {activeTab === 'all-words' && <AllWords words={words} isLoading={isLoading} setWords={setWords} />}
        </main>
      </div>
    </div>
  );
}

export default App;