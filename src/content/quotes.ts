import shivCharchaQuotes from '../../assets/data/shivCharchaQuotes.json';

export interface ShivQuote {
  id: string;
  quote: string;
  category: string;
  author: string;
  tags: string[];
}

export const quotesList: ShivQuote[] = shivCharchaQuotes as ShivQuote[];

// Helper utilities
export const getRandomQuote = (): ShivQuote => {
  const index = Math.floor(Math.random() * quotesList.length);
  return quotesList[index];
};

export const getQuotesByCategory = (category: string): ShivQuote[] => {
  return quotesList.filter((q) => q.category === category);
};

export const getCategories = (): string[] => {
  const categories = new Set(quotesList.map((q) => q.category));
  return Array.from(categories);
};
