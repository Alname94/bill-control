import { useEffect } from "react";

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} - Bill Control` : "Bill Control";
  }, [title]);
};
