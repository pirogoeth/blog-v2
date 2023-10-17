export interface Post {
  metadata: PostMetadata,
  synopsis: string,
  text: string,
};

export interface PostMetadata {
  categories: Array<string>,
  detail: PostDetail,
  metrics: PostMetrics,
  title: string,
  coverImage?: string,
  slug: string,
  synopsis?: string,
};

export interface PostAuthor {
  avatarUrl?: string,
  name: string,
  email?: string,
}

export interface PostDetail {
  author: PostAuthor,
  createdAt: string,
  description: string,
  etag: string,
  id: string,
  isPublic: string,
  updatedAt: string,
};

export interface PostMetrics {
  minutesRead: number|string,
  wordCount: number|string,
};