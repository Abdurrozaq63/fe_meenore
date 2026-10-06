export interface UpdateSessionPointPayload {
  text: string;
}

export interface UpdateSessionThemePayload {
  title: string;
  points: UpdateSessionPointPayload[];
}

export interface UpdateSessionPayload {
  title?: string;
  audioUrl?: string;
  audioDurationSeconds?: number;
  rawTranscript?: string;
  tagId?: string | null;
  themes?: UpdateSessionThemePayload[];
}

export interface UpdateSessionResponse {
  id: string;
  userId: string;
  tagId: string | null;
  title: string;
  audioUrl: string | null;
  audioDurationSeconds: number;
  rawTranscript: string | null;
  isFavourite: boolean;
  createdAt: string;
  updatedAt: string;
}
