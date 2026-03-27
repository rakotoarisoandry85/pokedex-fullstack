import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 8000,
});

export const getPokemons = (page = 1, items = 20) =>
  api.get("/pokemons/paginated", { params: { page, items } }).then((r) => r.data);

export const getAllPokemons = () =>
  api.get("/pokemons").then((r) => r.data);

export const getPokemon = (id) =>
  api.get(`/pokemon/${id}`).then((r) => r.data);

export const getTypes = () =>
  api.get("/types").then((r) => r.data);

export const searchPokemons = (params) =>
  api.get("/pokemons/search", { params }).then((r) => r.data);

export default api;
