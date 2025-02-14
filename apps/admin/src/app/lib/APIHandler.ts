import APIHandler from "@mymast/api";

const API = new APIHandler(process.env.NEXT_PUBLIC_API_URL || "https://localhost:5000");

export default API;