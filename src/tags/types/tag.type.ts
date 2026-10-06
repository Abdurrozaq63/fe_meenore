export type TagType = 'work' | 'class' | 'personal';

export interface Tag {
  id: string;
  title: string;
  type: TagType;
  sessionCount?: number;
}
