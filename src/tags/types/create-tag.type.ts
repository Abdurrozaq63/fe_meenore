import type { TagType } from './tag.type';

export interface CreateTagPayload {
  title: string;
  type: TagType;
}

export interface CreateTagResponse {
  id: string;
  userId: string;
  title: string;
  type: TagType;
  createdAt: string;
  updatedAt: string;
}
