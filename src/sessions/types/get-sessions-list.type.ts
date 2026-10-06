export interface SessionRecord {
  id: string;
  title: string;
  audioDurationSeconds: number;
  isFavourite: boolean;
  tagId: string | null;
  tagTitle: string | null;
  tagType: string | null;
  createdAt: string;
}
export interface SessionsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetSessionsList {
  data: SessionRecord[];
  meta: SessionsPaginationMeta;
}
