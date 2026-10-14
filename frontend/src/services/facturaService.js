import api from "../api/axios";

const ENDPOINT = "/bills";

export const createFactura = async (facturaData) => {
  const response = await api.post(ENDPOINT, facturaData);
  return response.data;
};

export const getFacturaById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const updateFactura = async (id, facturaData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, facturaData);
  return response.data;
};

export const deleteFactura = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
