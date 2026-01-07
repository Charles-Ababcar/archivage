// src/utils/errorHelper.ts
export const getErrorMessage = (err: any): string => {
  if (err && 'data' in err) {
    // FastAPI renvoie souvent { detail: "message" }
    return err.data?.detail || JSON.stringify(err.data);
  }
  return "Une erreur inattendue est survenue";
};