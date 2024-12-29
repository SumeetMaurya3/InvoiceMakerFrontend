import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/userSlice";

// Function to get tokens from cookies (or localStorage)
const getTokenFromCookies = () => {
    console.log(document.cookie);
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const refreshToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)refresh_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    return { accessToken, refreshToken };
  };
  
  // Function to validate access token
  export const validateAccessToken = async () => {
    const dispatch = useDispatch();
    const { accessToken } = getTokenFromCookies(); // Extract the token from cookies.
  
    if (!accessToken) {
      return false; // No access token, consider it invalid.
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/user/validate', 
        { token: accessToken }, // Send token in the request body
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      console.log(response);
      dispatch(setUser(response.data.user));
      return response.status === 200; // If validation succeeds, return true.
    } catch (error) {
      console.error("Error validating access token:", error);
      return false; // If an error occurs, the token is invalid.
    }
  };
  
  
  

// Function to refresh the token using the refresh token
export const refreshAccessToken = async () => {
    const { refreshToken } = getTokenFromCookies();
  
    if (!refreshToken) {
      return null; // No refresh token available
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/user/refresh', {}, {
        withCredentials: true // Ensure cookies are sent with the request
      });
  
      if (response.status === 200) {
        // Save the new access and refresh tokens (both should be returned from the backend)
        const { access_token, refresh_token } = response.data;
        document.cookie = `access_token=${access_token}; path=/; max-age=3600`;
        document.cookie = `refresh_token=${refresh_token}; path=/; max-age=86400`;
        return access_token;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null; // Return null if refresh fails
    }
  };
  
