'use client';

import { useSearchHistory } from '@/lib/hooks';
import { useEffect, useState } from 'react';

interface SearchHistoryProps {
  onSelectHistory: (username: string) => void;
}

export default function SearchHistory({ onSelectHistory }: SearchHistoryProps) {
  const { history, clearHistory } = useSearchHistory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-light rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">Recent Searches</h3>
        <button
          onClick={clearHistory}
          className="text-xs text-foreground/60 hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {history.map((username) => (
          <button
            key={username}
            onClick={() => onSelectHistory(username)}
            className="w-full text-left px-3 py-2 rounded-lg bg-surface hover:bg-primary/20 text-foreground text-sm transition-colors"
          >
            @{username}
          </button>
        ))}
      </div>
    </div>
  );
}
