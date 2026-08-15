import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const extractProfile = async (description) => {
  const response = await api.post(
    "/api/profile/extract",
    {
      description,
    }
  );

  return response.data;
};

export const createProfile = async (profile) => {
  const response = await api.post(
    "/api/profile/",
    profile
  );

  return response.data;
};

export const getProfile = async (profileId) => {
  const response = await api.get(
    `/api/profile/${profileId}`
  );

  return response.data;
};

export const getSchemes = async () => {
  const response = await api.get(
    "/api/schemes/"
  );

  return response.data;
};

export const getScheme = async (schemeId) => {
  const response = await api.get(
    `/api/schemes/${schemeId}`
  );

  return response.data;
};

export const evaluateEligibility = async (profileId) => {
  const response = await api.post(
    "/api/eligibility/evaluate",
    {
      profile_id: profileId,
    }
  );

  return response.data;
};

export default api;