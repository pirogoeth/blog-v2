export interface Post {
  metadata: PostMetadata,
  synopsis: string,
  text?: string,
  html?: string, 
};

export interface PostMetadata {
  categories: Array<string>,
  post: PostDetail,
  title: string,
  coverImage?: string,
  slug?: string,
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
  metrics: PostMetrics,
};

export interface PostMetrics {
  minutesRead: number,
  wordCount: number,
};