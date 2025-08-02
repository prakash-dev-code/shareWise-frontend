import { apiMethod } from "@/utils/apiMethods";

const signUp = async (body: any) => {
  return apiMethod(`api/v1/auth/signup`, "post", body);
};
const signIN = async (body: any) => {
  return apiMethod(`api/v1/auth/login/`, "post", body);
};

const getAllArticles = async () => {
  return apiMethod(`api/v1/articles`, "get", {}, true);
};
const getArticlesById = async (id: string) => {
  return apiMethod(`api/v1/articles/${id}`, "get", {}, true);
};
const createArticle = async (body: any) => {
  return apiMethod(`api/v1/articles/`, "post", body);
};
const deleteArticle = async (id: string) => {
  return apiMethod(`api/v1/articles/${id}/`, "delete");
};
const updateArticlesById = async (id: string, body: any) => {
  return apiMethod(`api/v1/articles/${id}`, "patch", body);
};
const getHistory = async (id: string) => {
  return apiMethod(`api/v1/articles/${id}/history`, "get", {}, true);
};
const generateSummary = async (id: string) => {
  return apiMethod(`api/v1/articles/${id}/summary`, "get", {}, true);
};

export const useApi = () => ({
  signIN,
  signUp,
  getAllArticles,
  getArticlesById,
  createArticle,
  deleteArticle,
  updateArticlesById,
  getHistory,
  generateSummary,
});
