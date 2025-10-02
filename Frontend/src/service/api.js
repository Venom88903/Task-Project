import axios from "axios";

// 🔗 Base URL of your FastAPI backend
const API_BASE_URL = Platform.OS == 'ios' ? 'http://localhost:8000' : "http://10.0.2.2:8000"; // For Android emulator
// If you're using physical device or iOS, use your machine IP like http://192.168.x.x:8000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add interceptor for adding token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧠 Helper to get token from storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { END_POINTS } from "./endPoints";
import { Platform } from "react-native";

const getToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (err) {
    console.log("Token fetch error", err);
    return null;
  }
};

export default api;


//Login API Call
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(END_POINTS.LOGIN, {
      email,
      password,
    });

    
    console.log("Login response:", response.data);

    // // Save token
    // await AsyncStorage.setItem("access_token", response.data.access_token);

    return response.data;
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);
    throw error;
  }
};


//Register API Call
export const registerUser = async (email, password) => {
  const response = await api.post(END_POINTS.REGISTER, {
    email,
    password,
  });
  console.log('register response:', response.data);
  return response.data;
}

// Fetch Notes API Call
export const fetchNotes = async () => {
  const response = await api.get(END_POINTS.GET_NOTES);
  console.log('notes response:', response.data);
  return response.data;
};

// Create Note API Call
export const createNote = async (title, content) => {
  const response = await api.post(END_POINTS.CREATE_NOTE, {
    title,
    content,
  });
  console.log('object', response.data);
  return response.data;
}


// Update Note API Call
export const updateNote = async (id, title, content) => {
  const response = await api.put(END_POINTS.UPDATE_NOTE(id), {
    title,
    content,
  });
  return response.data;
}

// Delete Note API Call
export const deleteNote = async (id) => {
  const response = await api.delete(END_POINTS.DELETE_NOTE(id));
  return response.data;
} 

  