import API from "./api";

// Search documents using keywords and OCR text
export const searchDocuments = async (query, filters = {}) => {
  const response = await API.get("/search", {
    params: {
      q: query,
      ...filters
    }
  });

  return response.data;
};

// Get search suggestions
export const getSearchSuggestions = async (query) => {
  const response = await API.get("/search/suggestions", {
    params: { q: query }
  });

  return response.data;
};

// Get available document categories for filtering
export const getSearchCategories = async () => {
  const response = await API.get("/search/categories");
  return response.data;
};

export default {
  searchDocuments,
  getSearchSuggestions,
  getSearchCategories
};