import api from "../api/axios";

const ENDPOINT = '/services';

export const getServiciosByUser = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const getServicioById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const createServicio = async (servicioData) => {
  const response = await api.post(ENDPOINT, servicioData);
  return response.data;
};

export const updateServicio = async (id, servicioData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, servicioData);
  return response.data;
};

export const deleteServicio = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};