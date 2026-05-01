'use client';

import { useState } from 'react';
import { useSearch, useSearchHistory } from '@/lib/hooks';

interface SearchFormProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [username, setUsername] = useState('');
  const { addToHistory } = useSearchHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      addToHistory(username.trim());
      onSearch(username);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Instagram username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-lg bg-surface text-foreground border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 disabled:opacity-50"
          aria-label="Instagram username"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-fit"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
