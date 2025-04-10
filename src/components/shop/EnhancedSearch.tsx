
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { enhancedSearch } from '@/services/aiService';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedSearchProps {
  onSearch: (query: string, enhancedResults?: string[]) => void;
  initialValue?: string;
}

const EnhancedSearch = ({ onSearch, initialValue = '' }: EnhancedSearchProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const handleSearch = async (useAI: boolean = false) => {
    if (!query.trim()) {
      onSearch('');
      return;
    }

    if (useAI) {
      setIsSearching(true);
      setIsEnhanced(true);
      
      try {
        const result = await enhancedSearch(query);
        if (result && result.productIds.length > 0) {
          onSearch(query, result.productIds);
          
          toast.success(
            result.matchReason 
              ? `Found items: ${result.matchReason}` 
              : "AI found relevant products"
          );
        } else {
          // If AI search returns no results, fallback to regular search
          onSearch(query);
          toast.info("No AI-enhanced matches found, showing standard results");
        }
      } catch (error) {
        console.error('Error with enhanced search:', error);
        // Fallback to regular search
        onSearch(query);
        toast.error("AI search unavailable, using standard search");
      } finally {
        setIsSearching(false);
      }
    } else {
      // Regular search without AI enhancement
      setIsEnhanced(false);
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(false);
    }
  };

  return (
    <div className="relative flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            &times;
          </button>
        )}
      </div>
      
      <Button onClick={() => handleSearch(false)} disabled={isSearching}>
        {isSearching && !isEnhanced ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={() => handleSearch(true)}
        disabled={isSearching || !query.trim()}
      >
        {isSearching && isEnhanced ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">AI Search</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default EnhancedSearch;
