export interface SessionPoint {
  id: string;
  text: string;
  order: number;
}

export interface SessionTheme {
  id: string;
  title: string;
  order: number;
  points: SessionPoint[];
}

export interface GetSessionDetailResponse {
  id: string;
  title: string;
  audioUrl: string;
  audioDurationSeconds: number;
  rawTranscript: string;
  isFavourite: boolean;
  themes: SessionTheme[];
}
