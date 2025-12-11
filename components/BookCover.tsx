import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface BookCoverProps {
  onStart: (question: string) => void;
  isGenerating: boolean;
}

const BookCover: React.FC<BookCoverProps> = ({ onStart, isGenerating }) => {
  const [question, setQuestion] = useState('');

  const suggestions = [
    "Who was Roberto Maestas?",
    "Tell me about Latino farmworkers.",
    "What is the Bracero program?",
    "History of Sea Mar Community Health Centers"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onStart(question);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-stone-200 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full mb-4 shadow-lg">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-2">
            The State We're In
          </h1>
          <h2 className="text-xl md:text-2xl font-serif text-orange-700 italic">
            Latino History in Washington
          </h2>
          <p className="mt-4 text-stone-600">
            Ask a question about Washington State history, and AI will weave it into an illustrated picture book for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to learn about?"
              disabled={isGenerating}
              className="w-full pl-6 pr-12 py-4 text-lg rounded-xl border-2 border-amber-200 bg-amber-100 text-amber-900 placeholder-amber-700/60 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 focus:outline-none transition-all shadow-inner disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isGenerating ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              ) : (
                <Sparkles className="text-amber-600" />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                disabled={isGenerating}
                onClick={() => setQuestion(s)}
                className="px-3 py-1 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isGenerating}
            className="w-full mt-6 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Writing Story...' : 'Read Book'}
            {!isGenerating && <ArrowRight size={24} />}
          </button>
        </form>
      </div>

      <footer className="absolute bottom-4 text-stone-400 text-sm">
        Powered by Gemini 2.5 • Content from League of Women Voters of WA
      </footer>
    </div>
  );
};

export default BookCover;