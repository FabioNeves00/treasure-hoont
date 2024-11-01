import axios from "axios";

export const api = axios.create({
  baseURL: "https://treasure-hoont.vercel.app/api",
})