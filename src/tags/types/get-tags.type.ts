import type { Tag } from './tag.type';

export interface GetTagsResponse {
  data: Tag[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
