import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = 'http://192.168.1.39:5000/api';

type User = {
  id:number,
  email: string,
  role: 'student'|'teacher'|'admin',
  roll_number: number|null,
  faculty_roll_number: number|null,
  // optional fields
  student_name?: string,
  faculty_name?: string
}

type AuthContextType = {
  user: User | null | undefined,
  token: string | null | undefined,
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>,
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async() => {},
  logout: async() => {},
  loading: true
})

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: {children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [token, setToken] = useState<string | null>();
  const [loading, setLoading] = useState(true);


  // Set axios default header for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkLogin = async () => {
      try{
        const savedToken = await SecureStore.getItemAsync('auth_token');
        if(savedToken){
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {Authorization: `Bearer ${savedToken}` }
          });
          setUser(response.data.user);
          setToken(savedToken);
        }
      } catch (e){
          console.log(e)
          await SecureStore.deleteItemAsync('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // console.log("in autpro")
      const response = await axios.post(`${API_URL}/auth/login`,{
        email,
        password
      }        
      )
      // console.log(response.data);
      const {token: newToken, user: newUser} = response.data;

      await SecureStore.setItemAsync('auth_token', newToken);

      setUser(newUser);
      setToken(newToken);
      // console.log(newToken);
    } catch (err:any){
      console.error("Login error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.error || "login failed");
    } finally{
        // console.log('here');
        setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{user, token, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
};