export interface ProcessSessionResponse {
  id: string;
  userId: string;
  tagId: string;
  title: string;
  audioUrl: string;
  audioDurationSeconds: number;
  rawTranscript: string;
  isFavourite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessSessionPayload {
  title: string;
  tagId: string;
  audioDurationSeconds: number;
  audio: File;
}
