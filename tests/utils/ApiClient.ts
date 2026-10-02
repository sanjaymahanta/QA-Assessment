import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {

  constructor(private request: APIRequestContext) {}

  async registerUser(
    username: string,
    email: string,
    password: string
  ) {
    const response = await this.request.post('/api/users', {
      data: {
        user: {
          username,
          email,
          password,
        },
      },
    });

    expect(response.status()).toBe(201);

    return response.json();
  }

  async loginUser(
    email: string,
    password: string
  ) {
    const response = await this.request.post('/api/users/login', {
      data: {
        user: {
          email,
          password,
        },
      },
    });

    expect(response.status()).toBe(200);

    return response.json();
  }

  async createArticle(
    token: string,
    title: string,
    description: string,
    body: string
  ) {
    const response = await this.request.post('/api/articles', {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title,
          description,
          body,
        },
      },
    });

    expect(response.status()).toBe(201);

    return response.json();
  }

  async getArticle(
    token: string,
    slug: string
  ) {
    return this.request.get(`/api/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }

  async updateArticle(
    token: string,
    slug: string,
    title: string,
    description: string,
    body: string
  ) {
    return this.request.put(`/api/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title,
          description,
          body,
        },
      },
    });
  }

  async deleteArticle(
    token: string,
    slug: string
  ) {
    return this.request.delete(`/api/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }
}