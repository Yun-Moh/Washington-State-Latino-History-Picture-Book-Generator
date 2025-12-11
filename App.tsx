import React, { useState } from 'react';
import BookCover from './components/BookCover';
import BookReader from './components/BookReader';
import { AppState, BookContent } from './types';
import { generateBookStory } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);

  const handleStart = async (question: string) => {
    setAppState(AppState.GENERATING_TEXT);
    try {
      const content = await generateBookStory(question);
      setBookContent(content);
      setAppState(AppState.READING);
    } catch (error) {
      console.error("Failed to generate book:", error);
      alert("Oops! The history books are stuck together. Please try asking again.");
      setAppState(AppState.HOME);
    }
  };

  const handleReset = () => {
    setAppState(AppState.HOME);
    setBookContent(null);
  };

  return (
    <>
      {appState === AppState.HOME || appState === AppState.GENERATING_TEXT ? (
        <BookCover 
          onStart={handleStart} 
          isGenerating={appState === AppState.GENERATING_TEXT} 
        />
      ) : (
        bookContent && (
          <BookReader 
            content={bookContent} 
            onReset={handleReset} 
          />
        )
      )}
    </>
  );
};

export default App;