import axios from "@/plugin/axios";

export function login(req) {
  return axios.post(`/login`, req);
}
