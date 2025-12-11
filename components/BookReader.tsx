import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react';
import { BookContent } from '../types';
import { generatePageImage } from '../services/geminiService';

interface BookReaderProps {
  content: BookContent;
  onReset: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ content, onReset }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [images, setImages] = useState<Record<number, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

  const currentPage = content.pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === content.pages.length - 1;

  // Function to load image for a specific page
  const loadImage = async (index: number) => {
    const page = content.pages[index];
    if (images[index] || loadingImages[index]) return;

    setLoadingImages(prev => ({ ...prev, [index]: true }));
    try {
      const imageUrl = await generatePageImage(page.imagePrompt);
      setImages(prev => ({ ...prev, [index]: imageUrl }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  // Load current page image and pre-load next
  useEffect(() => {
    loadImage(currentPageIndex);
    if (currentPageIndex < content.pages.length - 1) {
      loadImage(currentPageIndex + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-800 p-4 md:p-8">
      
      {/* Header controls */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 text-stone-300">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Home size={20} />
          <span className="hidden md:inline">Back to Library</span>
        </button>
        <h1 className="text-xl md:text-2xl font-serif text-center px-4 truncate flex-1">
          {content.title}
        </h1>
        <div className="w-20 text-right font-mono text-sm">
          {currentPageIndex + 1} / {content.pages.length}
        </div>
      </div>

      {/* Book Viewport */}
      <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/9] bg-stone-100 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row book-shadow border-8 border-stone-900">
        
        {/* Left Page (Image) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-stone-200 relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-stone-300">
          {loadingImages[currentPageIndex] ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mb-4"></div>
              <p className="font-serif italic animate-pulse">Illustrating history...</p>
            </div>
          ) : images[currentPageIndex] ? (
            <img 
              src={images[currentPageIndex]} 
              alt={currentPage.imagePrompt}
              className="w-full h-full object-cover animate-fadeIn" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-300">
              <span className="text-stone-500">Image unavailable</span>
            </div>
          )}
          
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-orange-50 opacity-10 pointer-events-none mix-blend-multiply"></div>
        </div>

        {/* Right Page (Text) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#fdfbf7] p-8 md:p-12 flex flex-col justify-center relative">
           {/* Paper texture overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
           
           <div className="z-10 prose prose-lg md:prose-xl prose-stone">
             <p className="font-serif text-stone-800 leading-loose text-lg md:text-2xl first-letter:text-5xl first-letter:font-bold first-letter:text-orange-700 first-letter:mr-2 first-letter:float-left">
               {currentPage.text}
             </p>
           </div>

           <div className="absolute bottom-6 right-8 text-xs text-stone-400 font-mono hidden md:block">
             Page {currentPage.pageNumber}
           </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => setCurrentPageIndex(p => Math.max(0, p - 1))}
          disabled={isFirstPage}
          className="p-4 rounded-full bg-stone-700 text-white hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-stone-700 transition-all shadow-lg"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex gap-2">
          {content.pages.map((_, idx) => (
            <div 
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentPageIndex ? 'bg-orange-500 scale-125' : 'bg-stone-600'}`}
            />
          ))}
        </div>

        {isLastPage ? (
          <button
             onClick={onReset}
             className="p-4 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 px-6"
          >
            <RotateCcw size={24} />
            <span className="font-bold">Read Another</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentPageIndex(p => Math.min(content.pages.length - 1, p + 1))}
            className="p-4 rounded-full bg-stone-700 text-white hover:bg-orange-600 transition-all shadow-lg"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookReader;