import React from 'react';
import './App.css';
import AddWordForm from './components/AddWordForm';
import ReviewCard from './components/ReviewCard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pronunciation Flashcards</h1>
      </header>
      <main>
        <AddWordForm />
        <hr style={{margin: '20px 0'}}/>
        <ReviewCard />
      </main>
    </div>
  );
}

export default App;