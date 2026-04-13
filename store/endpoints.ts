import api from "./api";

export const API_ENDPOINTS = {
  USERS: {
    BASE: api,
    GET_ALL: "/users/",
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: "/users/player",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    STATS: "/users/stats",
    SEARCH: "/users/search",
    FILTER: "/users/filter",
  },
  Players: {
    BASE: api,
    GET_ALL: "/users/players/",
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: "/users/player",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    STATS: "/users/stats",
    SEARCH: "/users/search",
    FILTER: "/users/filter",
  },
  PRODUCTS: {
    BASE: api,
    GET_ALL: "/products/",
    GET_BY_ID: (id: number) => `/products/${id}`,
    CREATE: "/products/",
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
  },
  TRAINER: {
    BASE: api,
    GET_ALL: "/users/trainers/",
    GET_BY_ID: (id: number) => `/users/trainers/${id}`,
    CREATE: "/users/trainer/",
    UPDATE: (id: number) => `/trainers/${id}`,
    DELETE: (id: number) => `/trainers/${id}`,
  },
};
