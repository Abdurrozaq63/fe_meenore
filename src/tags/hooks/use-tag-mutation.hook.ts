import { useState } from 'react';

import { createTag, deleteTag, updateTag } from '../services/tags.service';

import type {
  CreateTagPayload,
  CreateTagResponse,
} from '../types/create-tag.type';

import type {
  UpdateTagPayload,
  UpdateTagResponse,
} from '../types/update-tag.type';

export const useTagMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (
    payload: CreateTagPayload,
  ): Promise<CreateTagResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      return await createTag(payload);
    } catch (err: any) {
      console.error('Failed to create tag:', err);

      const message =
        err.response?.data?.message || 'Gagal membuat tag. Silakan coba lagi.';

      setError(Array.isArray(message) ? message.join(', ') : message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    tagId: string,
    payload: UpdateTagPayload,
  ): Promise<UpdateTagResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      return await updateTag(tagId, payload);
    } catch (err: any) {
      console.error('Failed to update tag:', err);

      const message =
        err.response?.data?.message ||
        'Gagal memperbarui tag. Silakan coba lagi.';

      setError(Array.isArray(message) ? message.join(', ') : message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (tagId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteTag(tagId);

      return true;
    } catch (err: any) {
      console.error('Failed to delete tag:', err);

      const message =
        err.response?.data?.message ||
        'Gagal menghapus tag. Silakan coba lagi.';

      setError(Array.isArray(message) ? message.join(', ') : message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,
  };
};
