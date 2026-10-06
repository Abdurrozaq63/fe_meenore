export interface SessionDetailPoint {
  id: string;
  text: string;
  order: number;
}

export interface SessionDetailTheme {
  id: string;
  title: string;
  order: number;
  points: SessionDetailPoint[];
}

export interface GetSessionDetailResponse {
  id: string;
  title: string;
  audioUrl: string;
  audioDurationSeconds: number;
  rawTranscript: string;
  isFavourite: boolean;
  createdAt: string;
  themes: SessionDetailTheme[];
}
