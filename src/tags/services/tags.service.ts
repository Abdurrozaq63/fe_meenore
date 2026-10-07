import { api } from '../../lib/api';

import type {
  CreateTagPayload,
  CreateTagResponse,
} from '../types/create-tag.type';

import type {
  UpdateTagPayload,
  UpdateTagResponse,
} from '../types/update-tag.type';
import type { Tag } from '../types/tag.type';

export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags');
  console.log('responsetagsservice', response);

  return response.data;
};

export const createTag = async (
  payload: CreateTagPayload,
): Promise<CreateTagResponse> => {
  const response = await api.post<CreateTagResponse>('/tags', payload);

  return response.data;
};

export const getTagById = async (tagId: string): Promise<TagResponse> => {
  const response = await api.get<TagResponse>(`/tags/${tagId}`);

  return response.data;
};

export const updateTag = async (
  tagId: string,
  payload: UpdateTagPayload,
): Promise<UpdateTagResponse> => {
  const response = await api.patch<UpdateTagResponse>(
    `/tags/${tagId}`,
    payload,
  );

  return response.data;
};

export const deleteTag = async (tagId: string): Promise<void> => {
  await api.delete(`/tags/${tagId}`);
};

export interface TagResponse {
  id: string;
  userId: string;
  title: string;
  type: 'work' | 'class' | 'personal';
  createdAt: string;
  updatedAt: string;
}
