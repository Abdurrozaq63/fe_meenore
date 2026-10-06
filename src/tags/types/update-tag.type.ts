import type { TagType } from './tag.type';

export interface UpdateTagPayload {
  title?: string;
  type?: TagType;
}

export interface UpdateTagResponse {
  id: string;
  userId: string;
  title: string;
  type: TagType;
  createdAt: string;
  updatedAt: string;
}
