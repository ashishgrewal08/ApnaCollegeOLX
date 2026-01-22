import API from "./api";

export const uploadImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await API.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data.urls;
};
