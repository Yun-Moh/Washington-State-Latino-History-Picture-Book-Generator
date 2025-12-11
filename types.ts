export interface BookPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageData?: string; // Base64 string of the generated image
  isLoadingImage?: boolean;
}

export interface BookContent {
  title: string;
  pages: BookPage[];
}

export enum AppState {
  HOME = 'HOME',
  GENERATING_TEXT = 'GENERATING_TEXT',
  READING = 'READING',
  ERROR = 'ERROR'
}

export interface HistoryContext {
  fullText: string;
}