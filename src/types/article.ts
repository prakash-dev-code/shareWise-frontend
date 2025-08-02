export interface Article {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
}

export interface ArticleRevision {
  id: string;
  articleId: string;
  title: string;
  content: string;
  createdAt: string;
  version: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
