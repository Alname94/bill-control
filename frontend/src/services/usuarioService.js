import api from "../api/axios";

const ENDPOINT = "/user";

export const getUsuario = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
}

export const updateUsuario = async (usuarioData) => {
  const response = await api.patch(ENDPOINT, usuarioData);
  return response.data;
}

export const updatePassword = async (passwordData) => {
  const response = await api.patch(`${ENDPOINT}/password`, passwordData);
  return response.data;
}

export const deleteUsuario = async () => {
  const response = await api.delete(ENDPOINT);
  return response.data;
}