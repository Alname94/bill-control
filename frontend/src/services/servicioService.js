import api from "../api/axios";

const ENDPOINT = '/services';

export const getServiciosByUser = async (params = {}) => {
  const response = await api.get(ENDPOINT, { params });
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

export const getFacturasByServicio = async (id, params = {}) => {
  const response = await api.get(`${ENDPOINT}/${id}/bills`, { params });
  return response.data;
}