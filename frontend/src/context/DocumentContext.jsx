import React, {
  createContext,
  useContext,
  useState
} from "react";

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState([]);

  const addDocument = (newDocument) => {
    setDocuments((previous) => [...previous, newDocument]);
  };

  const updateDocument = (documentId, updatedData) => {
    setDocuments((previous) =>
      previous.map((document) =>
        document.id === documentId
          ? { ...document, ...updatedData }
          : document
      )
    );
  };

  const deleteDocument = (documentId) => {
    setDocuments((previous) =>
      previous.filter((document) => document.id !== documentId)
    );
  };

  const getDocumentById = (documentId) => {
    return documents.find(
      (document) => document.id === documentId
    );
  };

  const clearDocuments = () => {
    setDocuments([]);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        setDocuments,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentById,
        clearDocuments
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error(
      "useDocuments must be used inside DocumentProvider"
    );
  }

  return context;
}