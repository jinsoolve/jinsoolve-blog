export type SearchMatchField =
  | "title"
  | "tags"
  | "categories"
  | "heading"
  | "description"
  | "slug"
  | "content";

export interface LocalSearchHeading {
  text: string;
  anchor: string;
}

export interface LocalSearchDocument {
  id: string;
  url: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  createdAt: string | null;
  updatedAt: string | null;
  featured: boolean;
  readingMinutes: number;
  headings: LocalSearchHeading[];
  content: string;
}

export interface LocalSearchIndex {
  version: number;
  documents: LocalSearchDocument[];
}

export interface LocalSearchResult extends LocalSearchDocument {
  resultUrl: string;
  score: number;
  matchedFields: SearchMatchField[];
  snippet: string;
}

export function normalizeSearchText(value?: string): string;
export function toChoseong(value?: string): string;
export function prepareSearchDocuments(documents: LocalSearchDocument[]): void;
export function searchDocuments(
  documents: LocalSearchDocument[],
  query: string,
  options?: { limit?: number }
): LocalSearchResult[];
export function getRecentDocuments(
  documents: LocalSearchDocument[],
  limit?: number
): LocalSearchResult[];
export function getPopularTerms(
  documents: LocalSearchDocument[],
  limit?: number
): string[];
export function getHighlightTerms(query: string): string[];
