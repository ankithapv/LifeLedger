import API from "./api";

// Upload a document
export const uploadDocument = async (file, metadata = {}) => {
  const formData = new FormData();

  formData.append("file", file);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  
  const response = await API.post("/documents/upload", formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
});
  return response.data;
};

// Get all documents
export const getDocuments = async () => {
  const response = await API.get("/documents");
  return response.data;
};

// Get a single document
export const getDocumentById = async (documentId) => {
  const response = await API.get(`/documents/${documentId}`);
  return response.data;
};

// Update document details
export const updateDocument = async (documentId, documentData) => {
  const response = await API.put(
    `/documents/${documentId}`,
    documentData
  );

  return response.data;
};

// Delete a document
export const deleteDocument = async (documentId) => {
  const response = await API.delete(`/documents/${documentId}`);
  return response.data;
};

// Download a document
export const downloadDocument = async (documentId) => {
  const response = await API.get(
    `/documents/${documentId}/download`,
    { responseType: "blob" }
  );

  return response.data;
};

// View a document
export const viewDocument = async (documentId) => {
  const response = await API.get(
    `/documents/${documentId}/view`,
    { responseType: "blob" }
  );

  return response.data;
};

export default {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  downloadDocument
};