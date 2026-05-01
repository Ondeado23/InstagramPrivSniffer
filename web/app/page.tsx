'use client';

import SearchForm from '@/components/SearchForm';
import ResultsGrid from '@/components/ResultsGrid';
import SearchHistory from '@/components/SearchHistory';
import { useSearch } from '@/lib/hooks';

export default function Home() {
  const { search, loading, result, error } = useSearch();

  const handleSearch = (username: string) => {
    search(username);
  };

  const handleHistorySelect = (username: string) => {
    search(username);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            InstagramPrivSniffer
          </h1>
          <p className="text-foreground/70 text-sm sm:text-base">
            Search private Instagram accounts and view collaborative posts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <SearchHistory onSelectHistory={handleHistorySelect} />
          </aside>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Form */}
            <SearchForm onSearch={handleSearch} loading={loading} />

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && !error && (
              <div>
                <ResultsGrid
                  posts={result.posts}
                  accountType={result.account_type}
                  isPrivate={result.is_private}
                />
              </div>
            )}

            {/* Empty State */}
            {!result && !error && !loading && (
              <div className="text-center py-12">
                <p className="text-foreground/60">
                  Enter a username to get started
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-foreground/60 mt-4">Searching...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-foreground/60">
          <p>For research and educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}
