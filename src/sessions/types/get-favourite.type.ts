import type {
  SessionRecord,
  SessionsPaginationMeta,
} from './get-sessions-list.type';

export interface GetFavouritesResponse {
  data: SessionRecord[];
  meta: SessionsPaginationMeta;
}
